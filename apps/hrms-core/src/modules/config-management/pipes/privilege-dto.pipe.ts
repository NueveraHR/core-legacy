import { DtoPipeTransform } from "@hrms-core/common/interfaces/dto-pipe-transform";
import { Privileges } from "@hrms-core/core/privilege/privilege.model";
import { PrivilegesDto } from "@hrms-core/dto/privilege.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrivilegesDtoPipe implements DtoPipeTransform<Privileges, PrivilegesDto>{

    constructor() { }

    transform(source: Privileges, options?: object): PrivilegesDto {
        return source;
    }
    transformExistent(source: Privileges, target: PrivilegesDto, options?: object): PrivilegesDto {
        return source;
    }
    canTransform(value: Privileges): boolean {
        return true;
    }

}