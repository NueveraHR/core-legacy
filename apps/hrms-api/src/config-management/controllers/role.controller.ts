import { Controller, Get, Post, Body, Res, HttpStatus, Query, Param, Delete } from '@nestjs/common';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { RoleFacade, RoleFilterCriteria } from '@hrms-core/modules/config-management/facades/role.facade';
import { Response } from 'express';
import { ErrorUtils } from '@hrms-api/common/error.utils';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';

@Controller('/roles')
export class RoleController {
    constructor(private roleFacade: RoleFacade) {

    }

    @Get()
    @Privileges('config.roles.access')
    async getRoles(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        const filterCriteria: RoleFilterCriteria = {};
        let result: any;

        if (page && Number(page) != NaN) {
            filterCriteria.page = Number(page);
        }

        if (pageSize && Number(pageSize) != NaN) {
            filterCriteria.pageSize = Number(pageSize);
        }

        await this.roleFacade.allRoles(filterCriteria).then(res => {
            result = res;
        });

        return result;
    }

    @Post('/add')
    @Privileges('config.roles.create')
    async createRole(@Body() roleDto: RoleDto, @Res() response: Response) {
        await this.roleFacade.createRole(roleDto)
            .then(role => response.json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Post('/update')
    @Privileges('config.roles.edit')
    async updateRole(@Body() roleDto: RoleDto, @Res() response: Response) {
        await this.roleFacade.updateRole(roleDto)
            .then(role => response.json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Get('/:roleId')
    @Privileges('config.roles.access')
    async getDetails(@Param('roleId') roleId: string, @Res() response: Response) {
        await this.roleFacade.roleDetails(roleId)
            .then(role => response.status(HttpStatus.OK).json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err))
    }

    @Delete('/role/:roleId')
    @Privileges('config.roles.delete')
    async deleteRole(@Param('roleId') roleId: string, @Res() response: Response) {
        await this.roleFacade.deleteRole(roleId)
            .then(role => response.status(HttpStatus.OK).json(role))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err))
    }
}