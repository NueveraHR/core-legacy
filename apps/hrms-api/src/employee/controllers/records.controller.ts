import { Controller, Get, Param, Query, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UserFacade, UserFilterCriteria } from '@hrms-core/modules/user-management/facades/user.facade';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/common/services/dto/error-dto.service';
import { Response } from 'express';
import { ErrorUtils } from '@hrms-api/common/error.utils';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';

@Controller('/employee/records')
@Privileges('employee.records.access')
export class EmployeeRecordController {
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

    @Get('/:id')
    async userDetails(@Param('id') id: string, @Res() response: Response) {
        await this.userFacade.userDetails(id)
            .then(user => response.status(HttpStatus.OK).json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
        return response
    }


    @Post('/add')
    @Privileges('employee.records.create')
    async addUser(@Body() userDto: UserDto, @Res() response: Response) {
        let result: UserDto | ErrorDto;

        await this.userFacade.createUser(userDto)
            .then(user => response.json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
        return result;
    }

}