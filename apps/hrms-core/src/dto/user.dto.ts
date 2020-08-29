import { RoleDto } from './role.dto';

export class UserDto {
    public id?: string;
    public username?: string;
    public firstName?: string;
    public lastName?: string;
    public password?: string;
    public email?: string;
    public cin?: string;
    public prefix?: string;
    public role?: RoleDto;
    public gender?: string;
    public phone?: string;
    public modeOfEmployment?: string;
    public department?: string;
}
