import { Injectable, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { RoleDto, RolePaginateDto } from '@hrms-core/dto/role.dto';
import { Role } from '@hrms-core/core/role/role.schema';

import { RoleService } from '@hrms-core/core/role/role.service';
import { PrivilegeService } from '@hrms-core/core/privilege/privilege.service';
import { PrivilegesDto } from '@hrms-core/dto/privilege.dto';
import { ErrorDto, DtoService } from '@hrms-core/common/services/dto/error-dto.service';
import { RoleDtoValidator } from '../validators/role-dto.validator';
import { RoleDtoReversePipe } from '../pipes/role-dto-reverse.pipe';
import { RoleDtoPipe } from '../pipes/role-dto.pipe';
import { PrivilegesDtoPipe } from '../pipes/privilege-dto.pipe';

@Injectable()
export class RoleFacade {
    @Inject(DtoService) dtoService: DtoService;

    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly roleService: RoleService,
        private readonly privilegeService: PrivilegeService,
        private readonly privilegesDtoPipe: PrivilegesDtoPipe,
        private readonly roleDtoPipe: RoleDtoPipe,
        private readonly roleDtoReversePipe: RoleDtoReversePipe,
        private readonly roleDtoValidator: RoleDtoValidator
    ) { }

    /**
     * Returns all registered roles in the database
     * Can be used in roles list view.
     */
    async allRoles(filterCriteria?: RoleFilterCriteria): Promise<RolePaginateDto> {
        return this.roleService.findAllPaginated(filterCriteria?.page, filterCriteria?.pageSize)
            .then(roles => {
                let rolePaginateDto: RolePaginateDto = {
                    total: roles.total,
                    pages: roles.pages,
                    page: roles.page,
                    limit: roles.limit,
                    offset: roles.offset,
                    docs: roles.docs.map(
                        role => this.roleDtoPipe.transform(role)
                    )
                }
                return rolePaginateDto;
            });
    }

    /**
     *  Returns fully detailed role info given its name.
     *  Can be used to view/modify an existing role 
     */
    async roleDetails(roleId: string, options?: object): Promise<RoleDto> {
        return this.roleService.findById(roleId)
            .then(role => this.roleDtoPipe.transform(role, options))
    }

    /**
     * Returns all grantable privileges. 
     * Can be used to grant privileges to a new or an existing role. 
     *
     */
    async allPrivileges(): Promise<PrivilegesDto> {
        const privileges = this.privilegeService.loadConfig();
        return this.privilegesDtoPipe.transform(privileges);
    }


    async createRole(roleDto: RoleDto): Promise<RoleDto> {

        //  * Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto);
        if (this.dtoService.isInstance(validationResult)) {
            return Promise.reject(validationResult);
        }

        return this.roleService.create(roleDto).then(role =>
            this.roleDtoPipe.transform(role)
        );
    }

    async updateRole(roleDto: RoleDto): Promise<RoleDto> {

        //  * Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto, { required: ['id'] });
        if (this.dtoService.isInstance(validationResult)) {
            return Promise.reject(validationResult);
        }

        // retrieve current registered role record.
        let savedRole: Role;
        let error: ErrorDto;

        await this.roleService
            .findById(roleDto.id)
            .then(role => savedRole = role)
            .catch(err => error = err);


        // Check for retrieval error
        if (error) {
            return Promise.reject(error);
        }

        // overwrite saved role properties
        savedRole = this.roleDtoReversePipe.transformExistent(roleDto, savedRole);
        return this.roleService.update(savedRole).then(role =>
            this.roleDtoPipe.transform(role)
        );
    }

    async deleteRole(roleId: string): Promise<boolean> {
        let findRoleResult: Role | ErrorDto;

        // retrieve current registered role record.
        await this.roleService.findById(roleId)
            .then(role => findRoleResult = role)
            .catch(err => findRoleResult = err);

        if (this.dtoService.isInstance(findRoleResult)) {
            return Promise.reject(findRoleResult);
        }

        return this.roleService.delete(findRoleResult as Role);
    }

}

export interface RoleFilterCriteria {
    page?: number,
    pageSize?: number,

    detailed?: boolean,
}

export type PrivilegesFilterOptions = {
    portalAccess: boolean,
    pagesAccess: boolean,
    actionsAuthorization: boolean
}