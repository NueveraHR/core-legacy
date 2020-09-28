import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { EmployeeFacade } from '@hrms-core/facades/employee.facade';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { AddEmployeeInput, UpdateEmployeeInput, JobInput } from '@hrms-api/employee/employee.input';
import { Employee, PaginatedEmployeeList, Job } from './employee.type';
import { ApiError } from '@hrms-api/common/utils/error.utils';
import { SortInput } from '@hrms-api/common/graphql/sort.input';
import { FilterUtils } from '@hrms-api/common/utils/filter.utils';
import { FilterInput } from '@hrms-api/common/graphql/filter.input';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { UserDto } from '@hrms-core/dto/user.dto';

@Resolver()
@Privileges('employees.access')
@RateLimit({ limit: 30, timeInterval: '1m' })
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
        return this.employeeFacade.list({ page, limit }, options).catch(ApiError);
    }

    @Query(() => Employee)
    employee(@CurrentUser() currentUser: UserDto, @Args('id', { type: () => ID }) employeeId: string): Promise<any> {
        //TODO: assert is eligible to view user sensitive data
        return this.employeeFacade.details(employeeId).catch(ApiError);
    }

    @Mutation(() => Employee)
    @Privileges('employees.create')
    addEmployee(@Args('employee') employee: AddEmployeeInput): Promise<any> {
        return this.employeeFacade.create(employee).catch(ApiError);
    }

    @Mutation(() => Employee)
    @Privileges('employees.edit')
    updateEmployee(@Args('employee') employee: UpdateEmployeeInput): Promise<any> {
        return this.employeeFacade.update(employee).catch(ApiError);
    }

    @Mutation(() => Job)
    @Privileges('employees.edit')
    addJob(@Args('employeeId', { type: () => ID }) employeeId: string, @Args('job') job: JobInput): Promise<any> {
        return this.employeeFacade.addJob(employeeId, job).catch(ApiError);
    }
}
