import { Controller, Post, Inject, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { AuthFacade } from '@hrms-core/common/auth/auth.facade';
import { Response } from 'express';
import { STATUS_CODES } from 'http';

@Controller('/auth')
export class AuthController {
    constructor(private authFacade: AuthFacade) {
    }

    @Post()
    @HttpCode(200)
    async attemptLogin(@Body() userDto: UserDto, @Res() response: Response) {
        if (!userDto) {
            response.json(new ErrorDto('Invalid credentials format'));
        }

        await this.authFacade.auth(userDto).then(res => {
            response.json(res);
        }).catch(err => {
            response.status(HttpStatus.UNAUTHORIZED).json(err);
        });

    }
}