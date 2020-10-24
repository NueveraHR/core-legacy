import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { EmployeeFacade } from '@hrms-facades/employee/employee.facade';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import {
    IgnorePrivileges,
    Privileges,
} from '@hrms-api/common/decorators/privileges.decorator';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import {
    AddEmployeeInput,
    UpdateEmployeeInput,
    SkillInput,
} from '@hrms-api/employee/graphql/employee.input';
import { Employee, PaginatedEmployeeList, Job } from './graphql/employee.type';
import { FORBIDDEN_ERROR, GqlError } from '@hrms-api/common/utils/error.utils';
import { SortInput } from '@hrms-api/common/graphql/sort.input';
import { FilterUtils } from '@hrms-api/common/utils/filter.utils';
import { FilterInput } from '@hrms-api/common/graphql/filter.input';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { UserDto } from '@hrms-core/user/user.dto';
import { Role } from '@hrms-core/role/role.schema';
import { UploadProfileImage } from '@hrms-api/upload/upload.type';
import { GraphQLUpload } from 'apollo-server';
import { FileUpload } from 'graphql-upload';
import { FileData } from '@hrms-core/common/interfaces/file.interface';

@Resolver()
@Privileges('employees.access')
@RateLimit({ limit: 300, timeInterval: '1m' })
@UseGuards(JwtAuthGuard, PrivilegesGuard, RateLimitGuard)
export class EmployeeResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Query(() => PaginatedEmployeeList)
    employees(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('filter', { type: () => FilterInput, nullable: true })
        filterInput?: FilterInput,
        @Args('sort', { type: () => SortInput, nullable: true }) sortInput?: SortInput,
    ): Promise<any> {
        const options = FilterUtils.fromInput(filterInput, sortInput);
        return this.employeeFacade.list({ page, limit }, options).catch(GqlError);
    }

    @Query(() => Employee)
    @IgnorePrivileges()
    employee(
        @CurrentUser() currentUser: UserDto,
        @Args('id', { type: () => ID }) employeeId: string,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.details(employeeId).catch(GqlError);
    }

    @Mutation(() => Employee)
    @Privileges('employees.create')
    addEmployee(@Args('employee') employee: AddEmployeeInput): Promise<any> {
        return this.employeeFacade.create(employee).catch(GqlError);
    }

    @Mutation(() => Employee)
    @Privileges('employees.edit')
    updateEmployee(@Args('employee') employee: UpdateEmployeeInput): Promise<any> {
        return this.employeeFacade.update(employee).catch(GqlError);
    }

    @Mutation(() => UploadProfileImage)
    uploadProfileImage(
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    ): Promise<UploadProfileImage> {
        const fileData: FileData = {
            name: file.filename,
            mimetype: file.mimetype,
            encoding: file.encoding,
            content: file.createReadStream(),
        };
        return this.employeeFacade.updateProfilePicture(employeeId, fileData);
    }

    @Mutation(() => Boolean)
    @IgnorePrivileges()
    @RateLimit({ limit: 7, timeInterval: '1m' })
    changePassword(
        @CurrentUser() currentUser: UserDto,

        @Args('employeeId') employeeId: string,
        @Args('currentPassword') currentPassword: string,
        @Args('newPassword') newPassword: string,
    ): Promise<any> {
        // keep password proprietary to the user only
        if (currentUser?.id === employeeId) {
            return this.employeeFacade
                .updatePassword(employeeId, currentPassword, newPassword)
                .catch(GqlError);
        }
    }

    @Mutation(() => Employee)
    @IgnorePrivileges()
    setSkills(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('skills', { type: () => [SkillInput] }) skills: SkillInput[],
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.setSkills(employeeId, skills);
    }
}

export const isOwner = (currentUser: UserDto, employeeId: string) => {
    return (
        currentUser.id == employeeId ||
        (currentUser.role as Role).privileges.findIndex(x => x == 'employees.access') !=
            -1
    );
};
