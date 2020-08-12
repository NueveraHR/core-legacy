import { Controller, Get, Param, Query, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UserFacade, UserFilterCriteria, UserPaginateDto } from '@hrms-core/modules/employee/facades/user.facade';
import { UserDto } from '@hrms-core/dto/user.dto';
import { Response } from 'express';
import { ErrorUtils } from '@hrms-api/common/error.utils';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';

@Controller('/employees')
@Privileges('employees.records.access')
export class EmployeeRecordController {
    constructor(private employeeFacade: UserFacade) { }

    @Get()
    allUsers(@Query('page') page: string, @Query('pageSize') pageSize: string): Promise<UserPaginateDto> {
        const filterCriteria: UserFilterCriteria = {};

        if (page && Number(page) != NaN) {
            filterCriteria.page = Number(page);
        }

        if (pageSize && Number(pageSize) != NaN) {
            filterCriteria.pageSize = Number(pageSize);
        }

        return this.employeeFacade.userList(filterCriteria);
    }

    @Get('/:id')
    userDetails(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        return this.employeeFacade.userDetails(id)
            .then(user => response.status(HttpStatus.OK).json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }


    @Post()
    @Privileges('employees.records.create')
    addUser(@Body() userDto: UserDto, @Res() response: Response): Promise<Response> {
        return this.employeeFacade.createUser(userDto)
            .then(user => response.json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

}