import { DtoPipeTransform } from "@hrms-core/common/interfaces/dto-pipe-transform";
import { Privileges } from "@hrms-core/core/privilege/privilege.model";
import { PrivilegesDto } from "@hrms-core/dto/privilege.dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrivilegesDtoPipe implements DtoPipeTransform<Privileges, string[]>{
    transform(source: Privileges, options?: object): string[] {
        return [];
    }

    transformExistent(source: Privileges, target: string[], options?: object): string[] {
        return [];
    }

    canTransform(value: Privileges): boolean {
        return true;
    }
}