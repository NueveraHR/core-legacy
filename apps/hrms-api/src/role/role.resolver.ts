import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@hrms-api/common/guards/gql-auth.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { Role, DeleteResult, PaginatedRoleList } from './role.type';
import { RoleFacade } from '@hrms-core/facades/role.facade';
import { AddRole, UpdateRole } from './role.input';

@Resolver()
@Privileges('roles.access')
@UseGuards(GqlAuthGuard, PrivilegesGuard)
export class RoleResolver {
    constructor(private roleFacade: RoleFacade) {}

    @Query(() => PaginatedRoleList)
    roles(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
    ): Promise<PaginatedRoleList> {
        return this.roleFacade.allRoles({ page, limit });
    }

    @Query(() => String)
    privileges(): string {
        return JSON.stringify(this.roleFacade.allPrivileges());
    }

    @Mutation(() => Role)
    addRole(@Args('role') role: AddRole): Promise<Role> {
        return this.roleFacade.createRole(role);
    }

    @Mutation(() => Role)
    updateRole(@Args('role') role: UpdateRole): Promise<Role> {
        return this.roleFacade.updateRole(role);
    }

    @Mutation(() => DeleteResult)
    deleteRoles(@Args('id', { type: () => [ID] }) id: string[]): Promise<DeleteResult> {
        return this.roleFacade.deleteMultipleRoles(id).then(result => {
            result.errors = JSON.stringify(result.errors);
            return result;
        });
    }
}
