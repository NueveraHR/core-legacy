
export interface PrivilegesDto {
    [module: string]: ModulePrivilegesDto
}

interface ModulePrivilegesDto {
    portals: string[],
    pages: string[],
    actions: string[],
}

