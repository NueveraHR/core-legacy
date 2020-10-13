import { PaginateResult } from 'mongoose';
import { NvrPaginateResult } from '@hrms-core/common/interfaces/pagination';
export class RoleDto {
    public id?: string;
    public name?: string;
    public description?: string;
    public privileges?: string[];
    public extendsRoles?: string[];
}

export type RolePaginateDto = NvrPaginateResult<RoleDto>;
