
export interface PrivilegeDto {
    [module: string]: PagesPrivileges;
}

export interface PagesPrivileges {
    [page: string]: Actions,
}

export interface Actions {
    [action: string]: string
}