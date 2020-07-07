import { Controller, Post } from '@nestjs/common';
import { UserDTO } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { AuthFacade } from '@hrms-core/common/auth/auth.facade';

@Controller('/auth')
export class AuthController {
    constructor(
        private _authFacade: AuthFacade
    ) { }

    @Post()
    async attemptLogin(userDto: UserDTO) {
        if (!userDto) {
            return new ErrorDto('Invalid credentials format');
        }

        let response;
        await this._authFacade.auth(userDto).then(res => {
            response = res;
        });

        return response;
    }
}