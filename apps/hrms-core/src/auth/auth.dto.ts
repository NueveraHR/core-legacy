import { UserDto } from '@hrms-core/user/user.dto';

export class AuthDto extends UserDto {
    token: string;
    userType: string;
}
