import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { PrivilegeDto } from '@hrms-core/privilege/privilege.dto';
import { Injectable } from '@nestjs/common';
import { PrivilegeService } from '@hrms-core/privilege/privilege.service';

@Injectable()
export class PrivilegesDtoPipe implements DtoTransformPipe<PrivilegeDto, string[]> {
    constructor(private readonly privilegeService: PrivilegeService) {}

    transform(source: PrivilegeDto, options?: object): string[] {
        return this.flatterKeys(source);
    }

    transformExistent(source: PrivilegeDto, target: string[], options?: object): string[] {
        return [];
    }

    canTransform(value: PrivilegeDto): boolean {
        return true;
    }

    flatterKeys(obj: unknown, prefix = '') {
        return Object.entries(obj).reduce((collector, [key, val]) => {
            const newKeys = [...collector, prefix ? `${prefix}.${key}` : key];
            if (typeof obj === 'object') {
                const newPrefix = prefix ? `${prefix}.${key}` : key;
                const otherKeys = this.flatterKeys(val, newPrefix);
                return [...newKeys, ...otherKeys];
            }
            return newKeys;
        }, []);
    }
}
