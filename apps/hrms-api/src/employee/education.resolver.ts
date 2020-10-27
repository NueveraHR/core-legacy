import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import {
    IgnorePrivileges,
    Privileges,
} from '@hrms-api/common/decorators/privileges.decorator';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { FORBIDDEN_ERROR, GqlError } from '@hrms-api/common/utils/error.utils';
import { UserDto } from '@hrms-core/user/user.dto';
import { EmployeeFacade } from '@hrms-facades/employee/employee.facade';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { AddEducationInput, UpdateEducationInput } from './graphql/employee.input';
import { isOwner } from './employee.resolver';
import { Education, Employee } from './graphql/employee.type';
import { GraphQLUpload } from 'apollo-server';
import { FileUpload } from 'graphql-upload';
import { FileData } from '@hrms-core/common/interfaces/file';
import { FileUtils } from '@hrms-api/common/utils/file.utils';

@Resolver()
@Privileges('employees.access')
@RateLimit({ limit: 100, timeInterval: '1m' })
@UseGuards(JwtAuthGuard, PrivilegesGuard, RateLimitGuard)
export class EducationResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addEducation(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('education') education: AddEducationInput,
        @Args('document', { type: () => GraphQLUpload, nullable: true })
        document?: FileUpload,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }

        let fileData: FileData;
        if (document) {
            fileData = FileUtils.fromUpload(document);
        }

        return this.employeeFacade
            .addEducation(employeeId, education, fileData)
            .catch(GqlError);
    }

    @Mutation(() => Education)
    @IgnorePrivileges()
    updateEducation(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('educationId', { type: () => ID }) educationId: string,
        @Args('education') education: UpdateEducationInput,
        @Args('deleteDocument', { type: () => Boolean, nullable: true })
        deleteDocument?: boolean,
        @Args('document', { type: () => GraphQLUpload, nullable: true })
        document?: FileUpload,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }

        let fileData: FileData;
        if (document) {
            fileData = FileUtils.fromUpload(document);
        }

        return this.employeeFacade
            .updateEducation(employeeId, educationId, education, deleteDocument, fileData)
            .catch(GqlError);
    }

    @Mutation(() => Boolean)
    @IgnorePrivileges()
    deleteEducation(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('educationId', { type: () => ID }) educationId: string,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.deleteEducation(educationId).catch(GqlError);
    }
}
