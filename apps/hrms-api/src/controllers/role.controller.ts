import { Controller, Get, Post, Body, Res, HttpStatus, Query, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { RoleDto, RolePaginateDto } from '@hrms-core/dto/role.dto';
import { RoleFacade, RoleFilterCriteria } from '@hrms-core/facades/role.facade';
import { Response } from 'express';
import { ErrorUtils } from '@hrms-core/common/error/error.utils';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';

@Controller('/roles')
@Privileges('roles.access')
export class RoleController {
    constructor(private roleFacade: RoleFacade) {}

    @Get()
    getRoles(@Query('page') page: string, @Query('pageSize') pageSize: string): Promise<RolePaginateDto> {
        const filterCriteria: RoleFilterCriteria = {};

        if (page && Number(page) != NaN) {
            filterCriteria.page = Number(page);
        }

        if (pageSize && Number(pageSize) != NaN) {
            filterCriteria.pageSize = Number(pageSize);
        }

        return this.roleFacade.allRoles(filterCriteria) as Promise<RolePaginateDto>;
    }

    @Get('/privileges')
    @HttpCode(200)
    getPrivileges(@Res() response: Response): Response {
        return response.json(this.roleFacade.allPrivileges());
    }

    @Post()
    @Privileges('roles.create')
    createRole(@Body() roleDto: RoleDto, @Res() response: Response): Promise<Response> {
        return this.roleFacade
            .createRole(roleDto)
            .then(role => response.json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Put('/:roleId')
    @Privileges('roles.edit')
    updateRole(
        @Param('roleId') roleId: string,
        @Body() roleDto: RoleDto,
        @Res() response: Response,
    ): Promise<Response> {
        return this.roleFacade
            .updateRole(roleId, roleDto)
            .then(role => response.json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Get('/:roleId')
    getDetails(@Param('roleId') roleId: string, @Res() response: Response): Promise<Response> {
        return this.roleFacade
            .roleDetails(roleId)
            .then(role => response.status(HttpStatus.OK).json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Delete('/:roleId')
    @Privileges('roles.delete')
    deleteRole(@Param('roleId') roleId: string, @Res() response: Response): Promise<Response> {
        return this.roleFacade
            .deleteRole(roleId)
            .then(role => response.status(HttpStatus.OK).json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Delete()
    @Privileges('roles.delete')
    deleteRoles(@Body() rolesId: string[], @Res() response: Response): Promise<Response> {
        return this.roleFacade
            .deleteMultipleRoles(rolesId)
            .then(role => response.status(HttpStatus.OK).json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }
}
