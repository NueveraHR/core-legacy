import { Controller, Post, Inject, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto, DtoService } from '@hrms-core/common/services/dto/error-dto.service';
import { AuthFacade } from '@hrms-core/common/auth/auth.facade';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';

@Controller('/auth')
export class AuthController {

    @Inject(DtoService) dtoService: DtoService;

    constructor(private authFacade: AuthFacade) {
    }

    @Post()
    @HttpCode(200)
    @Public()
    async attemptLogin(@Body() userDto: UserDto, @Res() response: Response) {
        if (!userDto) {
            response.json(this.dtoService.error(41000));
        }

        await this.authFacade.auth(userDto).then(res => {
            response.json(res);
        }).catch(err => {
            response.status(HttpStatus.UNAUTHORIZED).json(err);
        });

    }
}