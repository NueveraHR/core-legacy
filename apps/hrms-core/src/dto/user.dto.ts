import { RoleDto } from './role.dto';

export class UserDto {
    constructor(
        public id?: string,
        public username?: string,
        public firstName?: string,
        public lastName?: string,
        public password?: string,
        public email?: string,
        public cin?: string,
        public prefix?: string,
        public role?: string,
        public gender?: string,
        public phone?: number,
        public modeOfEmployment?: string,
        public department?: string,
    ) {}
}
