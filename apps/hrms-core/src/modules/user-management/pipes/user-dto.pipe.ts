import { PipeTransform, ArgumentMetadata, Injectable, Inject } from "@nestjs/common";
import { DtoPipeTransform } from "@hrms-core/common/interfaces/dto-pipe-transform.interface";
import { User } from "@hrms-core/core/user/user.schema";
import { UserDTO } from "@hrms-core/dto/user.dto";
import { PipTransformException } from "@hrms-core/common/exceptions/pipe-transform.exception";
import { LoggerService } from "@libs/logger";


@Injectable()
export class UserDtoPipe implements DtoPipeTransform<User, UserDTO> {

    @Inject(LoggerService) private logger: LoggerService;

    transform(value: User, options?: { detailed: boolean }): UserDTO {
        if (!value) {
            this.logger.warn('Could not transform User object: Invalid source value given ')
            throw new PipTransformException(`Invalid source value given`);
        }

        const userDto: UserDTO = {
            email: value.email,
            firstName: value.firstName,
            lastName: value.lastName,
            gender: value.gender,
        };

        if (options?.detailed) {
            userDto.username = value.username;
            userDto.cin = value.cin;
            userDto.prefix = value.prefix;
            userDto.phone = Number(value.phone);
            userDto.role = value.role as string;
        }

        return userDto;
    }

    canTransform(value: User): boolean {
        return true;
    }

}