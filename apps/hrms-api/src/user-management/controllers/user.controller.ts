import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserFacade } from '@hrms-core/modules/user-management/facades/user.facade';

@Controller('/users')
export class UserController {
    constructor(private userFacade: UserFacade) { }

    @Get()
    async allUsers(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        let result: any;

        await this.userFacade.userList({
            page: Number(page),
            pageSize: Number(pageSize)
        }).then(res => {
            result = res;
        });

        return result;
    }

    @Get('/details/:username')
    userDetails(username: string) {
        
    }



}