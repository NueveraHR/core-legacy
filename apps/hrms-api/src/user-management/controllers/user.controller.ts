import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserFacade, UserFilterCriteria } from '@hrms-core/modules/user-management/facades/user.facade';

@Controller('/users')
export class UserController {
    constructor(private userFacade: UserFacade) { }

    @Get()
    async allUsers(@Query('page') page: string, @Query('pageSize') pageSize: string) {
        let result: any;
        const filterCriteria: UserFilterCriteria = {};

        if (page && Number(page) != NaN) {
            filterCriteria.page = Number(page);
        }

        if (pageSize && Number(pageSize) != NaN) {
            filterCriteria.pageSize = Number(pageSize);
        }

        await this.userFacade.userList(filterCriteria).then(res => {
            result = res;
        });

        return result;
    }

    @Get('/details/:username')
    userDetails(username: string) {

    }



}