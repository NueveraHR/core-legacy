export interface PrivilegeDto {
    [module: string]: Actions;
}

export interface Actions {
    [action: string]: string;
}
