import { DtoPipeTransform } from "@hrms-core/common/interfaces/dto-pipe-transform";
import { Role } from "@hrms-core/core/role/role.schema";
import { RoleDto } from "@hrms-core/dto/role.dto";

export class RoleDtoPipe implements DtoPipeTransform<Role, RoleDto> {
    transform(source: Role, options?: object): RoleDto {
        let roleDto = new RoleDto();
        return this.transformExistent(source, roleDto);
    }

    transformExistent(source: Role, target: RoleDto, options?: object): RoleDto {
        target.name = source.name;
        target.description = source.description;
        target.privileges = source.privileges;
        target.id = source.id;
        target.extendsRoles = target.extendsRoles;

        return target;
    }

    canTransform(value: Role): boolean {
        return true;
    }

}