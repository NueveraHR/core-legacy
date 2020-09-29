import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { PrivilegesGuard } from '@hrms-api/common/guards/role.guard';
import { Role, DeleteResult, PaginatedRoleList } from './role.type';
import { RoleFacade } from '@hrms-core/facades/role.facade';
import { AddRole, UpdateRole } from './role.input';
import { GqlError } from '@hrms-api/common/utils/error.utils';
import { SortInput } from '@hrms-api/common/graphql/sort.input';
import { FilterInput } from '@hrms-api/common/graphql/filter.input';
import { FilterUtils } from '@hrms-api/common/utils/filter.utils';

@Resolver()
@Privileges('roles.access')
@UseGuards(JwtAuthGuard, PrivilegesGuard)
export class RoleResolver {
    constructor(private roleFacade: RoleFacade) {}

    @Query(() => PaginatedRoleList)
    roles(
        @Args('page', { type: () => Int }) page: number,
        @Args('limit', { type: () => Int }) limit: number,
        @Args('filter', { type: () => FilterInput, nullable: true }) filterInput?: FilterInput,
        @Args('sort', { type: () => SortInput, nullable: true }) sortInput?: SortInput,
    ): Promise<any> {
        const options = FilterUtils.fromInput(filterInput, sortInput);
        return this.roleFacade.allRoles({ page, limit }, options).catch(GqlError);
    }

    @Query(() => String)
    privileges(): string {
        return JSON.stringify(this.roleFacade.allPrivileges());
    }

    @Mutation(() => Role)
    @Privileges('roles.create')
    addRole(@Args('role') role: AddRole): Promise<any> {
        return this.roleFacade.createRole(role).catch(GqlError);
    }

    @Mutation(() => Role)
    @Privileges('roles.edit')
    updateRole(@Args('role') role: UpdateRole): Promise<any> {
        return this.roleFacade.updateRole(role).catch(GqlError);
    }

    @Mutation(() => DeleteResult)
    @Privileges('roles.delete')
    deleteRoles(@Args('id', { type: () => [ID] }) id: string[]): Promise<any> {
        return this.roleFacade
            .deleteMultipleRoles(id)
            .then(result => {
                result.errors = JSON.stringify(result.errors);
                return result;
            })
            .catch(GqlError);
    }
}
