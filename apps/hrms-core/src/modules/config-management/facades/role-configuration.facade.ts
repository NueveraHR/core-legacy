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
export class RoleConfigurationFacade {

    constructor(private readonly _moduleRef: ModuleRef) {

    }

    private _roleService;
    get roleService(): RoleService {
        if (!this._roleService) { // Use strict: false to inject modules existing outside of the current module
            this._roleService = this._moduleRef.get(RoleService, { strict: false });
        }
        return this._roleService;
    }

    private _privilegeService;
    get privilegeService(): PrivilegeService {
        if (!this._privilegeService) {
            this._privilegeService = this._moduleRef.get(PrivilegeService, { strict: false });
        }
        return this._privilegeService;
    }

    private _roleDtoPipe: RoleDtoPipe;
    get roleDtoPipe(): RoleDtoPipe {
        if (!this._roleDtoPipe) {
            this._roleDtoPipe = new RoleDtoPipe();
        }
        return this._roleDtoPipe;
    }

    private _roleDtoReversePipe: RoleDtoReversePipe;
    get roleDtoReversePipe(): RoleDtoReversePipe {
        if (!this._roleDtoReversePipe) {
            this._roleDtoReversePipe = this._moduleRef.get(RoleDtoReversePipe);
        }
        return this._roleDtoReversePipe;
    }

    private _roleDtoValidator: RoleDtoValidator;
    get roleDtoValidator(): RoleDtoValidator {
        if (!this._roleDtoValidator) {
            this._roleDtoValidator = this._moduleRef.get(RoleDtoValidator);
        }
        return this.roleDtoValidator;
    }

    private _privilegesDtoPipe: PrivilegesDtoPipe;
    get privilegesDtoPipe(): PrivilegesDtoPipe {
        if (!this._privilegesDtoPipe) {
            this._privilegesDtoPipe = new PrivilegesDtoPipe();
        }
        return this._privilegesDtoPipe;
    }

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
    async roleDetails(roleName: string, options?: object): Promise<RoleDto> {
        return this.roleService.findByRoleName(roleName).then(role => {
            return this.roleDtoPipe.transform(role, options);
        })
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

    async deleteRole() {
        //Deleting Roles for a given user
        let role = new Role;
        return this.roleService.delete(role);
    }

}


export type PrivilegesFilterOptions = {
    portalAccess: boolean,
    pagesAccess: boolean,
    actionsAuthorization: boolean
}