import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@hrms-api/common/guards/gql-auth.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { Role, DeleteResult, PaginatedRoleList } from './role.type';
import { RoleFacade } from '@hrms-core/facades/role.facade';
import { AddRole, UpdateRole } from './role.input';
import { ApiError } from '@hrms-api/common/utils/error.utils';

@Resolver()
@Privileges('roles.access')
@UseGuards(GqlAuthGuard, PrivilegesGuard)
export class RoleResolver {
    constructor(private roleFacade: RoleFacade) {}

    @Query(() => PaginatedRoleList)
    roles(@Args('page', { type: () => Int }) page: number, @Args('limit', { type: () => Int }) limit: number) {
        return this.roleFacade.allRoles({ page, limit }).catch(ApiError);
    }

    @Query(() => String)
    privileges(): string {
        return JSON.stringify(this.roleFacade.allPrivileges());
    }

    @Mutation(() => Role)
    addRole(@Args('role') role: AddRole) {
        return this.roleFacade.createRole(role).catch(ApiError);
    }

    @Mutation(() => Role)
    updateRole(@Args('role') role: UpdateRole) {
        return this.roleFacade.updateRole(role).catch(ApiError);
    }

    @Mutation(() => DeleteResult)
    deleteRoles(@Args('id', { type: () => [ID] }) id: string[]) {
        return this.roleFacade
            .deleteMultipleRoles(id)
            .then(result => {
                result.errors = JSON.stringify(result.errors);
                return result;
            })
            .catch(ApiError);
    }
}
