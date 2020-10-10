import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { IgnorePrivileges, Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { FORBIDDEN_ERROR } from '@hrms-api/common/utils/error.utils';
import { Employee } from '@hrms-core/core/employee/employee.schema';
import { UserDto } from '@hrms-core/dto/user.dto';
import { EmployeeFacade } from '@hrms-core/facades/employee.facade';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { AddEducationInput } from './employee.input';
import { isOwner } from './employee.resolver';

@Resolver()
@Privileges('employees.access')
@RateLimit({ limit: 300, timeInterval: '1m' })
@UseGuards(JwtAuthGuard, PrivilegesGuard, RateLimitGuard)
export class EducationResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addEducation(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('education') education: AddEducationInput,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.addEducation(employeeId, education);
    }
}
