import { Controller, Post, Inject, Body, HttpCode } from '@nestjs/common';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { AuthFacade } from '@hrms-core/common/auth/auth.facade';

@Controller('/auth')
export class AuthController {
    constructor(private authFacade: AuthFacade) {
    }

    @Post()
    @HttpCode(200)
    async attemptLogin(@Body() userDto: UserDto) {
        if (!userDto) {
            return new ErrorDto('Invalid credentials format');
        }

        let response;
        await this.authFacade.auth(userDto).then(res => {
            response = res;
        }).catch(err => response = err);

        return response;
    }
}