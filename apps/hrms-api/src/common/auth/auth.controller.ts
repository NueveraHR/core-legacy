import { Controller, Post, Inject, Body } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { AuthFacade } from '@hrms-core/common/auth/auth.facade';
import { ModuleRef } from '@nestjs/core';

@Controller('/auth')
export class AuthController {
    constructor(private _authFacade: AuthFacade) {
    }

    @Post()
    async attemptLogin(@Body() userDto: UserDto) {
        if (!userDto) {
            return new ErrorDto('Invalid credentials format');
        }

        let response;
        await this._authFacade.auth(userDto).then(res => {
            response = res;
        }).catch(err => response = err);

        return response;
    }
}