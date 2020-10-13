import { CurrentUser } from '@hrms-api/common/decorators/currentUser.decorator';
import { IgnorePrivileges } from '@hrms-api/common/decorators/privileges.decorator';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { FORBIDDEN_ERROR, GqlError } from '@hrms-api/common/utils/error.utils';
import { UserDto } from '@hrms-core/dto/user.dto';
import { EmployeeFacade } from '@hrms-core/facades/employee.facade';
import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { isOwner } from './employee.resolver';
import { AddPassportInput, UpdatePassportInput } from './graphql/employee.input';
import { Employee, Passport } from './graphql/employee.type';

@Resolver()
@RateLimit({ limit: 100, timeInterval: '1m' })
@UseGuards(JwtAuthGuard, PrivilegesGuard, RateLimitGuard)
export class PassportResolver {
    constructor(private employeeFacade: EmployeeFacade) {}

    @Mutation(() => Employee)
    @IgnorePrivileges()
    addPassport(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('passport') passport: AddPassportInput,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.addPassport(employeeId, passport).catch(GqlError);
    }

    @Mutation(() => Passport)
    updatePassport(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('passportId', { type: () => ID }) passportId: string,
        @Args('passport') passport: UpdatePassportInput,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.updatePassport(passportId, passport).catch(GqlError);
    }

    @Mutation(() => Boolean)
    @IgnorePrivileges()
    deletePassport(
        @CurrentUser() currentUser: UserDto,
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('passportId', { type: () => ID }) passportId: string,
    ): Promise<any> {
        if (!isOwner(currentUser, employeeId)) {
            return Promise.reject(FORBIDDEN_ERROR);
        }
        return this.employeeFacade.deletePassport(passportId).catch(GqlError);
    }
}
