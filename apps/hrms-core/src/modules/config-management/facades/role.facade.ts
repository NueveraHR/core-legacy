import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { RoleDto, RolePaginateDto } from '@hrms-core/dto/role.dto';
import { Role } from '@hrms-core/core/role/role.schema';

import { RoleService } from '@hrms-core/core/role/role.service';
import { PrivilegeService } from '@hrms-core/core/privilege/privilege.service';
import { PrivilegesDto } from '@hrms-core/dto/privilege.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { RoleDtoValidator } from '../validators/role-dto.validator';
import { RoleDtoReversePipe } from '../pipes/role-dto-reverse.pipe';
import { RoleDtoPipe } from '../pipes/role-dto.pipe';
import { PrivilegesDtoPipe } from '../pipes/privilege-dto.pipe';

@Injectable()
export class RoleFacade {

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
            }).catch(err => Promise.reject(new ErrorDto(`Could not create role :: ${err.message}`)));
    }

    /**
     *  Returns fully detailed role info given its name.
     *  Can be used to view/modify an existing role 
     */
    async roleDetails(roleName: string, options?: object): Promise<RoleDto> {
        return this.roleService.findByRoleName(roleName)
            .then(role => this.roleDtoPipe.transform(role, options))
            .catch(err => Promise.reject(new ErrorDto(err.message)));
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
        if (validationResult instanceof ErrorDto) {
            return Promise.reject(validationResult);
        }

        return this.roleService.create(roleDto).then(role =>
            this.roleDtoPipe.transform(role)
        ).catch(err => Promise.reject(new ErrorDto(err.message)));
    }

    async updateRole(roleDto: RoleDto): Promise<RoleDto> {

        //  * Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto, { required: ['id'] });
        if (validationResult instanceof ErrorDto) {
            return Promise.reject(validationResult);
        }

        // retrieve current registered role record.
        let savedRole: Role;
        let error: ErrorDto;

        await this.roleService.findById(roleDto.id).then(role => {
            savedRole = role;
        }).catch(err => error = new ErrorDto(err.message));

        // Check for retrieval error
        if (error) {
            return Promise.reject(error);
        }

        // overwrite saved role properties
        savedRole = this.roleDtoReversePipe.transformExistent(roleDto, savedRole);
        return this.roleService.update(savedRole).then(role =>
            this.roleDtoPipe.transform(role)
        ).catch(err => Promise.reject(new ErrorDto(err.message)));
    }

    async deleteRole(roleId: string): Promise<boolean> {
        if (!roleId) {
            return Promise.reject(new ErrorDto('Cannot delete role without role id'));
        }
        let findRoleResult: Role | ErrorDto;
        await this.roleService.findById(roleId)
            .then(role => findRoleResult = role)
            .catch(err => findRoleResult = new ErrorDto('Cannot find role for given id'));

        if (findRoleResult instanceof ErrorDto) {
            return Promise.reject(findRoleResult);
        } else {
            return this.roleService.delete(findRoleResult)
                .then(rs => rs.deletedCount == 1)
                .catch(err => Promise.reject(new ErrorDto(err.message)));
        }
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