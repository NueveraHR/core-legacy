import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { RoleFacade } from '@hrms-core/modules/config-management/facades/role.facade';
import { Response } from 'express';

@Controller('/roles')
export class RoleController {
    constructor(private roleFacade: RoleFacade) {

    }

    @Post('/add')
    async addRole(@Body() roleDto: RoleDto, @Res() response: Response) {
        await this.roleFacade.createRole(roleDto)
            .then(role => response.json(role))
            .catch(err => response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    }
}