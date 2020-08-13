import { Controller, Post, Inject, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto, ErrorService } from '@hrms-core/common/error/error.service';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { Errors } from '@hrms-core/common/error/error.const';

@Controller('/auth')
export class AuthController {

    @Inject(ErrorService) errorService: ErrorService;

    constructor(private authFacade: AuthFacade) {
    }

    @Post()
    @HttpCode(200)
    @Public()
    attemptLogin(@Body() userDto: UserDto, @Res() response: Response): Promise<any> {
        if (!userDto) {
            response.json(this.errorService.generate(Errors.Login.INVALID_REQUEST));
        }

        return this.authFacade.auth(userDto).then(res => {
            response.json(res);
        }).catch(err => {
            response.status(HttpStatus.UNAUTHORIZED).json(err);
        });

    }
}