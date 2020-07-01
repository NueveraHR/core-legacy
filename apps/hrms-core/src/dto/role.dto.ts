import { PrivilegesDto } from "./privilege.dto";

export class RoleDto {
    constructor(
        public name: string,
        public description: string,
        public privileges: PrivilegesDto,
        public extendsRoles?: string[],
    ) { }

}

