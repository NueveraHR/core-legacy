import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { RoleDto } from '@hrms-core/dto/role.dto';
import { Role } from '@hrms-core/core/role/role.schema';

import { RoleService } from '@hrms-core/core/role/role.service';
import { PrivilegeService } from '@hrms-core/core/privilege/privilege.service';
import { PrivilegesDto } from '@hrms-core/dto/privilege.dto';
import { Privileges } from '@hrms-core/core/privilege/privilege.model';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { isNullOrUndefined } from 'util';

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
    public async allRoles(): Promise<RoleDto[]> {
        return this.roleService.findAll().then(roles => {
            let roleDto = roles.map(role => this.roleDtoPipe.apply(role));
            return roleDto;
        });
    }

    /**
     *  Returns fully detailed role info given its name.
     *  Can be used to view/modify an existing role 
     */
    public async roleDetails(roleName: string, options: DtoPipeOptions = null): Promise<RoleDto> {
        return this.roleService.findByRoleName(roleName).then(role => {
            return this.roleDtoPipe.apply(role, options);
        })
    }

    /**
     * Returns all grantable privileges. 
     * Can be used to grant privileges to a new or an existing role. 
     *
     */
    public async allPrivileges(): Promise<PrivilegesDto> {
        const privileges = this.privilegeService.loadConfig();
        return this.privilegesDtoPipe.apply(privileges);
    }


    public createRole(roleDto: RoleDto): Promise<RoleDto | ErrorDto> {
        //  * Validate given roleDto data
        if (roleDto.description.toString().trim()!= (null || "" || undefined)){  
        try{
            return this.roleService.create(roleDto);
        }
        //  * Catch errors and log them using logger library
        catch{
            err => {
            return new ErrorDto(err.message, 1000 ,'Invalid Description')}
        }
            if (roleDto.name.toString().trim() != (null || "" || undefined) &&
            this.roleService.findByRoleName(roleDto.name) == (null || undefined)){
                //  * Try to register role into the DB
                try{
                    return this.roleService.create(roleDto);
                }
                catch{
                    err => {
                    return new ErrorDto(err.message, 1001 ,'Invalid Name')}
                }

                if (roleDto.privileges.length.toString() == "2" && roleDto.privileges.toString().trim() != (null || "" || undefined) ){
                    try{
                        return this.roleService.create(roleDto);
                    }
                    catch{
                        err => {
                         return new ErrorDto(err.message, 1002 ,'Insufficient/Unidentified roles')}
                    }
                }
            }
        }
        console.log(roleDto)
        //  * Return registered role data otherwise
        return this.roleService.create(roleDto).then(role => {
            return this.roleDtoPipe.apply(role);
        }).catch(err => {
            return new ErrorDto(err.message, 45558, 'Application has failed to save role');
        });
    }

    public async updateRole(roleDto: RoleDto): Promise<RoleDto | ErrorDto> {
        let role = new Role ;
        /*role2 =this.roleService.create(roleDto).then(role => {
            return this.roleDtoPipe.apply(role);
        }).catch(err => {
            return new ErrorDto(err.message, 45558, 'Application has failed to save role');
        });*/
        if (roleDto.description.toString().trim()!= (null || "" || undefined)){  
            try{
                return this.roleService.update(role);
            }
            //  * Catch errors and log them using logger library
            catch{
                err => {
                return new ErrorDto(err.message, 1000 ,'Invalid Description')}
            }
                if (roleDto.name.toString().trim() != (null || "" || undefined) &&
                this.roleService.findByRoleName(roleDto.name) == (null || undefined)
                ){
                    //  * Try to update role from the DB
                    try{
                        return this.roleService.update(role);
                    }
                    catch{
                        err => {
                        return new ErrorDto(err.message, 1001 ,'Invalid Name')}
                    }
    
                    if (roleDto.privileges.length.toString() == "2" && roleDto.privileges.toString().trim() != (null || "" || undefined) ){
                        try{
                            return this.roleService.update(role);
                        }
                        catch{
                            err => {
                            return new ErrorDto(err.message, 1002 ,'Insufficient/Unidentified roles')}
                        }
                    }
                }
            }
            console.log(roleDto)
            //  * Return registered role data otherwise
            return this.roleService.update(role).then(role => {
                return this.roleDtoPipe.apply(role);
            }).catch(err => {
                return new ErrorDto(err.message, 45558, 'Application has failed to update role');
            });
    }

    public async deleteRole() {
        //Deleting Roles for a given user
        let role = new Role;
        return this.roleService.delete(role);
    }

}

export class RoleDtoPipe {

    constructor() { }

    apply(role: Role, options?: DtoPipeOptions): RoleDto {
        let roleDto = new RoleDto(role.name, role.description, role.privileges, role.extendsRoles);

        return roleDto;
    }
}

export class PrivilegesDtoPipe {
    constructor() { }

    apply(privileges: Privileges, options?: DtoPipeOptions): PrivilegesDto {
        return privileges;
    }
}


export type DtoPipeOptions = { addDescription: boolean };
export type PrivilegesFilterOptions = {
    portalAccess: boolean,
    pagesAccess: boolean,
    actionsAuthorization: boolean
}