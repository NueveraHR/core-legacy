import { Controller, Post, Inject, Body, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto, DtoService } from '@hrms-core/common/services/dto/error-dto.service';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';

@Controller('/auth')
export class AuthController {

    @Inject(DtoService) dtoService: DtoService;

    constructor(private authFacade: AuthFacade) {
    }

    @Post()
    @HttpCode(200)
    @Public()
    attemptLogin(@Body() userDto: UserDto, @Res() response: Response): Promise<any> {
        if (!userDto) {
            response.json(this.dtoService.error(41000));
        }

        return this.authFacade.auth(userDto).then(res => {
            response.json(res);
        }).catch(err => {
            response.status(HttpStatus.UNAUTHORIZED).json(err);
        });

    }
}