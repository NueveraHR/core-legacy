import { Controller, Get, Param, Query, Post, Body, Res, HttpStatus, Put } from '@nestjs/common';
import { UserFacade, PaginationOptions, UserPaginateDto } from '@hrms-core/modules/user/facades/user.facade';
import { UserDto } from '@hrms-core/dto/user.dto';
import { Response } from 'express';
import { ErrorUtils } from '@hrms-core/common/error/error.utils';
import { Privileges } from '@hrms-api/common/decorators/privileges.decorator';
import { EmployeeFacade } from '@hrms-core/modules/employee/facades/employee.facade';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';

@Controller('/employees')
@Privileges('employees.access')
export class EmployeeRecordController {
    constructor(private userFacade: UserFacade, private employeeFacade: EmployeeFacade) { }

    @Get()
    allUsers(@Query('page') page: string, @Query('pageSize') pageSize: string): Promise<UserPaginateDto> {
        const paginationOptions: PaginationOptions = {};

        if (page && Number(page) != NaN) {
            paginationOptions.page = Number(page);
        }

        if (pageSize && Number(pageSize) != NaN) {
            paginationOptions.pageSize = Number(pageSize);
        }

        return this.employeeFacade.list(paginationOptions);
    }

    @Get('/:id')
    userDetails(@Param('id') id: string, @Res() response: Response): Promise<Response> {
        return this.userFacade.details(id)
            .then(user => response.status(HttpStatus.OK).json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }


    @Post()
    @Privileges('employees.create')
    addUser(@Body() userDto: EmployeeDto, @Res() response: Response): Promise<Response> {
        return this.employeeFacade.create(userDto)
            .then(user => response.json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

    @Put('/:id')
    @Privileges('employees.edit')
    updateEmployee(@Param('id') id: string, @Body() roleDto: UserDto, @Res() response: Response): Promise<Response> {
        return this.userFacade.update(id, roleDto)
            .then(user => response.json(user))
            .catch(err => response.status(ErrorUtils.responseCode(err)).json(err));
    }

}