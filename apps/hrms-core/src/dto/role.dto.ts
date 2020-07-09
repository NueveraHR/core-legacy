import { PrivilegesDto } from "./privilege.dto";
import { PaginateResult } from "mongoose";

export class RoleDto {
    constructor(
        public id?: string,
        public name?: string,
        public description?: string,
        public privileges?: PrivilegesDto,
        public extendsRoles?: string[],
    ) { }

}

export type RolePaginateDto = PaginateResult<RoleDto>;

