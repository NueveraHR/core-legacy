import { Resolver, Query } from '@nestjs/graphql';
import { EmployeeFacade } from '@hrms-core/facades/employee.facade';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { UserDto } from '@hrms-core/dto/user.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@hrms-api/common/guards/gql-auth.guard';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';

@Resolver()
@Privileges('employees.access')
@UseGuards(GqlAuthGuard, PrivilegesGuard)
export class EmployeeResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Query(() => [UserDto])
    employees(): Promise<EmployeeDto[]> {
        return this.employeeFacade.list() as Promise<EmployeeDto[]>;
    }
}
