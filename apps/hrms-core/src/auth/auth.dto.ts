import { UserDto } from '@hrms-core/dto/user.dto';

export class AuthDto extends UserDto {
    token: string;
    userType: string;
}
