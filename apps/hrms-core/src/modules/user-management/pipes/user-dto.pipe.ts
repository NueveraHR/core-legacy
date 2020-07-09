import { PipeTransform, ArgumentMetadata, Injectable, Inject } from "@nestjs/common";
import { DtoPipeTransform } from "@hrms-core/common/interfaces/dto-pipe-transform";
import { User } from "@hrms-core/core/user/user.schema";
import { UserDTO } from "@hrms-core/dto/user.dto";
import { PipTransformException } from "@hrms-core/common/exceptions/pipe-transform.exception";
import { LoggerService } from "@libs/logger";


@Injectable()
export class UserDtoPipe implements DtoPipeTransform<User, UserDTO> {

    @Inject(LoggerService) private logger: LoggerService;

    transform(source: User, options?: { detailed: boolean }): UserDTO {
        if (!source) {
            this.logger.warn('Could not transform User object: Invalid source value given ')
            throw new PipTransformException(`Invalid source value given`);
        }

        const userDto: UserDTO = {
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
            userDto.role = source.role as string;
        }

        return userDto;
    }

    transformExistent(source: User, target: UserDTO, options?: object): UserDTO {
        return null;
    }

    canTransform(value: User): boolean {
        return true;
    }

}