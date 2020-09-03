import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { EmployeeFacade } from '@hrms-core/facades/employee.facade';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@hrms-api/common/guards/gql-auth.guard';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { AddEmployeeInput } from '@hrms-api/employee/employee.input';
import { Employee, PaginatedEmployeeList } from './employee.type';
import { ApiError } from '@hrms-api/common/utils/error.utils';

@Resolver()
@Privileges('employees.access')
@UseGuards(GqlAuthGuard, PrivilegesGuard)
export class EmployeeResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Query(() => PaginatedEmployeeList)
    employees(@Args('page', { type: () => Int }) page: number, @Args('limit', { type: () => Int }) limit: number) {
        return this.employeeFacade.list({ page, limit }).catch(ApiError);
    }

    @Query(() => Employee)
    employee(@Args('id', { type: () => ID }) employeeId: string) {
        //TODO: assert is eligible to view user sensitive data
        return this.employeeFacade.details(employeeId).catch(ApiError);
    }

    @Mutation(() => Employee)
    addEmployee(@Args('employee') employee: AddEmployeeInput) {
        return this.employeeFacade.create(employee).catch(ApiError);
    }
}
