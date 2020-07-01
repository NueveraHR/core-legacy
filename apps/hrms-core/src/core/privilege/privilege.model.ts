export interface ModulePrivileges {
    portals: string[],
    pages: string[],
    actions: string[],
}

export interface Privileges {
    [module: string]: ModulePrivileges;
}