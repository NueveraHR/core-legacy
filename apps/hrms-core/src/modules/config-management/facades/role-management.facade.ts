import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { RoleDto } from '@hrms-core/dto/role.dto';
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
export class RoleManagementFacade {

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
    async allRoles(): Promise<RoleDto[]> {
        return this.roleService.findAll().then(roles => {
            let roleDto = roles.map(role => this.roleDtoPipe.transform(role));
            return roleDto;
        });
    }

    /**
     *  Returns fully detailed role info given its name.
     *  Can be used to view/modify an existing role 
     */
    async roleDetails(roleName: string, options?: object): Promise<RoleDto | ErrorDto> {
        return this.roleService.findByRoleName(roleName)
            .then(role => this.roleDtoPipe.transform(role, options))
            .catch(err => new ErrorDto(err.message));
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


    async createRole(roleDto: RoleDto): Promise<RoleDto | ErrorDto> {

        //  * Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto);
        if (validationResult instanceof ErrorDto) {
            return validationResult;
        }

        return this.roleService.create(roleDto).then(role =>
            this.roleDtoPipe.transform(role)
        ).catch(err => new ErrorDto(err.message));
    }

    async updateRole(roleDto: RoleDto): Promise<RoleDto | ErrorDto> {

        //  * Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto, { required: ['id'] });
        if (validationResult instanceof ErrorDto) {
            return validationResult;
        }

        // retrieve current registered role record.
        let savedRole: Role;
        let error: ErrorDto;

        await this.roleService.findById(roleDto.id).then(role => {
            savedRole = role;
        }).catch(err => error = new ErrorDto(err.message));

        // Check for retrieval error
        if (error) {
            return error;
        }

        // overwrite saved role properties
        savedRole = this.roleDtoReversePipe.transformExistent(roleDto, savedRole);
        return this.roleService.update(savedRole).then(role =>
            this.roleDtoPipe.transform(role)
        ).catch(err => new ErrorDto(err.message));
    }

    async deleteRole(roleId: string): Promise<boolean | ErrorDto> {
        if (!roleId) {
            return new ErrorDto('Cannot delete role without role id');
        }
        let findRoleResult: Role | ErrorDto;
        await this.roleService.findById(roleId)
            .then(role => findRoleResult = role)
            .catch(err => findRoleResult = new ErrorDto('Cannot find role for given id'));

        if (findRoleResult instanceof ErrorDto) {
            return findRoleResult;
        } else {
            return this.roleService.delete(findRoleResult)
                .then(rs => rs.deletedCount == 1)
                .catch(err => new ErrorDto(err.message));
        }
    }

}


export type PrivilegesFilterOptions = {
    portalAccess: boolean,
    pagesAccess: boolean,
    actionsAuthorization: boolean
}