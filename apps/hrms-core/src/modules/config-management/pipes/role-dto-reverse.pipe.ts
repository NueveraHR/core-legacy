import { DtoPipeTransform } from "@hrms-core/common/interfaces/dto-pipe-transform";
import { RoleDto } from "@hrms-core/dto/role.dto";
import { Role } from "@hrms-core/core/role/role.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RoleDtoReversePipe implements DtoPipeTransform<RoleDto, Role> {

    transform(source: RoleDto, options?: object): Role {
        let role = new Role();
        return this.transformExistent(source, role, options);
    }

    transformExistent(source: RoleDto, target: Role, options?: object): Role {
        target.name = source.name;
        target.description = source.description;
        target.privileges = source.privileges;

        if (source.id) {
            target.id = source.id;
        }

        if (source.extendsRoles) {
            target.extendsRoles = source.extendsRoles;
        }

        return target;
    }

    canTransform(value: RoleDto): boolean {
        return true;
    }

}