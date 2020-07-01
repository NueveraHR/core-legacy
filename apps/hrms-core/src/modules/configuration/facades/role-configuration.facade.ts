import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { RoleDto } from '@hrms-core/dto/role.dto';
import { Role } from '@hrms-core/core/role/role.schema';

import { RoleService } from '@hrms-core/core/role/role.service';
import { PrivilegeService } from '@hrms-core/core/privilege/privilege.service';

@Injectable()
export class RoleConfigurationFacade {

    constructor(private readonly _moduleRef: ModuleRef) {

    }

    private _roleService;
    get roleService(): RoleService {
        if (!this._roleService) {
            this._roleService = this._moduleRef.get(RoleService);
        }
        return this._roleService;
    }

    private _privilegeService;
    get privilegeService(): PrivilegeService {
        if (!this._privilegeService) {
            this._privilegeService = this._moduleRef.get(PrivilegeService);
        }
        return this._privilegeService;
    }

    get roleDtoPipe(): RoleDtoPipe {
        return new RoleDtoPipe();
    }

    public async getAllRegisteredRoles(options: DtoPipeOptions = null): Promise<RoleDto[]> {
        return this.roleService.findAll().then(roles => {
            let roleDto = roles.map(role => this.roleDtoPipe.apply(role, options));
            return roleDto;
        });
    }

    public async getRoleDetails(roleName: string, options: DtoPipeOptions = null): Promise<RoleDto> {
        return this.roleService.findByRoleName(roleName).then(role => {
            return this.roleDtoPipe.apply(role, options);
        })
    }

    // public getPrivileges(searchQuery: string, filterOptions: PrivilegesFilterOptions = null): string[] {
        
    // }

}

export class RoleDtoPipe {

    constructor() { }

    apply(role: Role, options?: DtoPipeOptions): RoleDto {
        let roleDto = new RoleDto(role.name, role.description, role.privileges);

        return roleDto;
    }

}

export type DtoPipeOptions = { privilegeDescription: boolean };
export type PrivilegesFilterOptions = {
    portalAccess: boolean,
    pagesAccess: boolean,
    actionsAuthorization: boolean
}