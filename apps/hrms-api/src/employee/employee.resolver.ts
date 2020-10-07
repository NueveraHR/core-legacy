import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { EmployeeFacade } from '@hrms-core/facades/employee.facade';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { IgnorePrivileges, Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import {
    AddEmployeeInput,
    UpdateEmployeeInput,
    JobInput,
    AddEducationInput,
    AddCertificationInput,
    AddLanguageInput,
    SkillInput,
} from '@hrms-api/employee/employee.input';
import { Employee, PaginatedEmployeeList, Job } from './employee.type';
import { FORBIDDEN_ERROR, GqlError } from '@hrms-api/common/utils/error.utils';
import { SortInput } from '@hrms-api/common/graphql/sort.input';
import { FilterUtils } from '@hrms-api/common/utils/filter.utils';
import { FilterInput } from '@hrms-api/common/graphql/filter.input';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { UserDto } from '@hrms-core/dto/user.dto';
import { Role } from '@hrms-core/core/role/role.schema';

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
        @Args('filter', { type: () => FilterInput, nullable: true }) filterInput?: FilterInput,
        @Args('sort', { type: () => SortInput, nullable: true }) sortInput?: SortInput,
    ): Promise<any> {
        const options = FilterUtils.fromInput(filterInput, sortInput);
        return this.employeeFacade.list({ page, limit }, options).catch(GqlError);
    }

    @Query(() => Employee)
    @IgnorePrivileges()
    employee(@CurrentUser() currentUser: UserDto, @Args('id', { type: () => ID }) employeeId: string): Promise<any> {
        if (!this.isAllowed(currentUser, employeeId)) {
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

    @Mutation(() => Job)
    @Privileges('employees.edit')
    addJob(@Args('employeeId', { type: () => ID }) employeeId: string, @Args('job') job: JobInput): Promise<any> {
        return this.employeeFacade.addJob(employeeId, job).catch(GqlError);
    }

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addEducation(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('education') education: AddEducationInput,
    ): Promise<any> {
        if (!this.isAllowed(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.addEducation(employeeId, education);
    }

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addCertification(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('cert') cert: AddCertificationInput,
    ): Promise<any> {
        if (!this.isAllowed(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.addCertification(employeeId, cert);
    }

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addLanguage(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('lang') lang: AddLanguageInput,
    ): Promise<any> {
        if (!this.isAllowed(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.addLanguage(employeeId, lang);
    }

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addSkills(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('skills', { type: () => [SkillInput] }) skills: SkillInput[],
    ): Promise<any> {
        if (!this.isAllowed(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.addSkills(employeeId, skills);
    }

    private isAllowed(currentUser: UserDto, employeeId: string) {
        return (
            currentUser.id == employeeId ||
            (currentUser.role as Role).privileges.findIndex(x => x == 'employees.access') != -1
        );
    }
}
