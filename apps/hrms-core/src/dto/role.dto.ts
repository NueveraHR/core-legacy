
export class RoleDto {
    constructor(
        public name: string,
        public description: string,
        public privileges: PrivilegeDto,
        public extendsRoles?: string[],
    ) { }

}

export interface ModulePrivilegesDto {
    portals: string[],
    pages: string[],
    actions: string[],
}

interface PrivilegeDto {
    [module: string]: ModulePrivilegesDto
}