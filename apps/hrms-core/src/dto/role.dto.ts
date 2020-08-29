import { PaginateResult } from 'mongoose';
export class RoleDto {
    public id?: string;
    public name?: string;
    public description?: string;
    public privileges?: string[];
    public extendsRoles?: string[];
}

export type RolePaginateDto = PaginateResult<RoleDto>;
