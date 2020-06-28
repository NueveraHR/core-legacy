export class RoleDto {
    constructor(
        public name: string,
        public description: string,
        public privileges: string[],
        public extendsRoles?: string[],

        public allPrivileges?: string[],
    ) { }

}