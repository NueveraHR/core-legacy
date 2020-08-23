import { Injectable, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { RoleDto, RolePaginateDto } from '@hrms-core/dto/role.dto';
import { Role } from '@hrms-core/core/role/role.schema';

import { RoleService } from '@hrms-core/core/role/role.service';
import { PrivilegeService } from '@hrms-core/core/privilege/privilege.service';
import { PrivilegeDto } from '@hrms-core/dto/privilege.dto';
import { ErrorDto, ErrorService } from '@hrms-core/common/error/error.service';
import { RoleDtoValidator } from '../core/role/validators/role-dto.validator';
import { RoleDtoReversePipe } from '../core/role/pipes/role-dto-reverse.pipe';
import { RoleDtoPipe } from '../core/role/pipes/role-dto.pipe';
import { PrivilegesDtoPipe } from '../core/role/pipes/privilege-dto.pipe';
import { ValidatorUtils } from '@hrms-core/common/utils/validator.utils';
import { Errors } from '@hrms-core/common/error/error.const';

@Injectable()
export class RoleFacade {
    @Inject(ErrorService) errorService: ErrorService;

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
    allRoles(filterCriteria?: RoleFilterCriteria): Promise<RolePaginateDto> {
        return this.roleService.findAllPaginated(filterCriteria?.page, filterCriteria?.pageSize)
            .then(roles => {
                const rolePaginateDto: RolePaginateDto = {
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
    roleDetails(roleId: string, options?: unknown): Promise<RoleDto> {
        return this.roleService.findById(roleId)
            .then(role => {
                if (role)
                    return this.roleDtoPipe.transform(role, options);
                else
                    return Promise.reject(this.errorService.generate(Errors.Role.DETAILS_INVALID_REQUEST));

            })
    }

    /**
     * Returns all grantable privileges. 
     * Can be used to grant privileges to a new or an existing role. 
     *
     */
    allPrivileges(): PrivilegeDto {
        return this.privilegeService.loadConfig();
    }


    async createRole(roleDto: RoleDto): Promise<RoleDto> {

        //  * Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto);
        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // check no role with same name exists
        let exists: boolean | ErrorDto;
        await this.roleService.findByName(roleDto.name)
            .then(role => exists = role != null)
            .catch(err => exists = err);

        if (this.errorService.isError(exists))
            return Promise.reject(exists);
        else if (exists)
            return Promise.reject(this.errorService.generate(Errors.Role.CREATE_DUPLICATED))

        // otherwise, try to save new role
        return this.roleService.create(roleDto).then(role => {
            if (role)
                return this.roleDtoPipe.transform(role)
            else
                return Promise.reject(this.errorService.generate(Errors.Role.CREATE_INVALID_REQUEST))
        });
    }

    async updateRole(roleId: string, roleDto: RoleDto): Promise<RoleDto> {

        //  Validate given roleDto data
        const validationResult = this.roleDtoValidator.validate(roleDto);
        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // retrieve current registered role record.
        let result: Role | ErrorDto;
        await this.roleService
            .findById(roleId)
            .then(role => result = role)
            .catch(err => result = err);


        // Check for retrieval error
        if (this.errorService.isError(result))
            return Promise.reject(result);
        else if (!result)
            return Promise.reject(this.errorService.generate(Errors.Role.UPDATE_INVALID_REQUEST));

        // overwrite saved role properties
        const savedRole = this.roleDtoReversePipe.transformExistent(roleDto, result as Role);
        return this.roleService.update(savedRole).then(role =>
            this.roleDtoPipe.transform(role)
        );
    }

    async deleteRole(roleId: string): Promise<boolean> {
        if (!ValidatorUtils.isValidId(roleId)) {
            return Promise.reject((this.errorService.generate(Errors.Role.DELETE_INVALID_ID)))
        }

        // retrieve current registered role record.
        let result: Role | ErrorDto;
        await this.roleService
            .findById(roleId)
            .then(role => result = role)
            .catch(err => result = err);


        // Check for retrieval error
        if (this.errorService.isError(result))
            return Promise.reject(result);
        else if (!result)
            return Promise.reject(this.errorService.generate(Errors.Role.UNKNOWN_ROLE));

        return this.roleService.delete((result as Role).id);
    }


    async deleteMultipleRoles(rolesId: string[]): Promise<MultipleDeleteResult> {
        const result = new MultipleDeleteResult();
        const deleteCalls = [];

        // register all delete calls
        rolesId.forEach(roleId => {
            deleteCalls.push(
                this.deleteRole(roleId)
                    .then((deleted) => {
                        if (deleted) {
                            result.accepted.push(roleId);
                        } else {
                            Promise.reject(this.errorService.generate(Errors.Role.UNKNOWN_ROLE));
                        }
                    })
                    .catch((err) => {
                        result.failed.push(roleId);
                        result.errors[roleId] = err;
                    }))
        });

        // wait for calls execution
        await Promise.all(deleteCalls);

        // return delete result
        return result;
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

export class MultipleDeleteResult {
    accepted: string[] = [];
    failed: string[] = [];
    errors: any = {};
}