import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { UserFacade, UserFilterCriteria } from '@hrms-core/modules/user-management/facades/user.facade';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';

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


    @Post('/add')
    async addUser(@Body() userDto: UserDto) {
        let result: UserDto | ErrorDto;

        await this.userFacade.createUser(userDto)
            .then(res => result = res)
            .catch(err => result = err);
        return result;
    }

}