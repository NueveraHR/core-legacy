import { RoleDto } from './role.dto';

export class UserDto {
    public id?: string;

    public username?: string;
    public email?: string;
    public cin?: string;
    public prefix?: string;
    public firstName?: string;
    public preferredName?: string;
    public middleName?: string;
    public lastName?: string;
    public gender?: string;
    public birthDate?: Date;

    public password?: string;
    public phone?: string;
    public role?: RoleDto | string;

    public modeOfEmployment?: string;
    public department?: string;
}
