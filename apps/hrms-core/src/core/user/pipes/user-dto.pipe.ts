import { PipeTransform, ArgumentMetadata, Injectable, Inject } from '@nestjs/common';
import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { User } from '@hrms-core/core/user/user.schema';
import { UserDto } from '@hrms-core/dto/user.dto';
import { PipTransformException } from '@hrms-core/common/exceptions/pipe-transform.exception';
import { LoggerService } from '@libs/logger';
import { RoleDtoPipe } from '@hrms-core/core/role/pipes/role-dto.pipe';
import { Role } from '@hrms-core/core/role/role.schema';

@Injectable()
export class UserDtoPipe implements DtoTransformPipe<User, UserDto> {
    @Inject(LoggerService) private logger: LoggerService;
    @Inject(RoleDtoPipe) private roleDtoPipe: RoleDtoPipe;

    transform(source: User, options?: { detailed: boolean }): UserDto {
        if (!source) {
            this.logger.warn(`Could not transform USer object: Invalid source value given : ${source}`);
            throw new PipTransformException(`Invalid source value given`);
        }

        const userDto: UserDto = {
            id: source.id,
            email: source.email,
            firstName: source.firstName,
            lastName: source.lastName,
            gender: source.gender,
        };

        if (options?.detailed) {
            userDto.username = source.username;
            userDto.cin = source.cin;
            userDto.prefix = source.prefix;
            userDto.phone = Number(source.phone);
            userDto.role = source.role as string; // this.roleDtoPipe.transform(source.role as Role);
        }

        return userDto;
    }

    transformExistent(source: User, target: UserDto, options?: any): UserDto {
        return null;
    }

    canTransform(value: User): boolean {
        return true;
    }
}
