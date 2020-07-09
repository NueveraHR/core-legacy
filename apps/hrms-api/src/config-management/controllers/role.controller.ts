import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { RoleFacade } from '@hrms-core/modules/config-management/facades/role.facade';

@Controller('/roles')
export class RoleController {
    constructor(private roleFacade: RoleFacade) {

    }

    @Post('/add')
    async addRole(@Body() roleDto: RoleDto) {
        let response;
        await this.roleFacade.createRole(roleDto)
            .then(role => response = role)
            .catch(err => response = err);

        return response;
    }
}