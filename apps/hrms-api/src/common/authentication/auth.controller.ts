import { Controller, Post } from '@nestjs/common';
import { userDTO } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';

@Controller('/auth')
export class AuthController {
    constructor() { }

    @Post()
    attempt(userDto: userDTO) {
        if (!userDto) {
            return new ErrorDto('Invalid credentials format');
        }

        return {}; // TODO: call auth service
    }
}