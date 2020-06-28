export interface PortalPrivileges {
    accessAllowed: boolean;
    pages: string[],
    actions: string[],
}

export interface PortalPrivilegesConfig {
    [portal: string]: PortalPrivileges;
} 