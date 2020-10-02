import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { Role } from '@hrms-core/core/role/role.schema';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { Injectable, Inject } from '@nestjs/common';
import { LoggerService } from '@libs/logger';
import { PipTransformException } from '@hrms-core/common/exceptions/pipe-transform.exception';

@Injectable()
export class RoleDtoPipe implements DtoTransformPipe<Role, RoleDto> {
    @Inject(LoggerService) private logger: LoggerService;

    transform(source: Role, options?: unknown): RoleDto {
        const roleDto = new RoleDto();
        return this.transformExistent(source, roleDto);
    }

    transformExistent(source: Role, target: RoleDto, options?: unknown): RoleDto {
        if (!source) {
            this.logger.warn(`Could not transform Role object: Invalid source value given : ${source}`);
            throw new PipTransformException(`Invalid source value given`);
        }
        target.name = source.name;
        target.description = source.description;
        target.privileges = source.privileges;
        target.id = source.id;
        target.extendsRoles = source.extendsRoles;

        return target;
    }

    canTransform(source: Role): boolean {
        return source?.name?.length > 0;
    }
}
