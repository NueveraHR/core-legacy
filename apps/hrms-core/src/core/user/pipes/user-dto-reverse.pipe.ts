import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { UserDto } from '@hrms-core/dto/user.dto';
import { User } from '@hrms-core/core/user/user.schema';
import { Injectable } from '@nestjs/common';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { Address } from '@hrms-core/core/address/address.schema';
import { AddressReversePipe } from '@hrms-core/core/address/pipes/address-reverse.pipe';

@Injectable()
export class UserDtoReversePipe implements DtoTransformPipe<UserDto, User> {
    constructor(private addressReversePipe: AddressReversePipe) {}

    transform(userDto: UserDto, options?: object): User {
        const user = new User();
        return this.transformExistent(userDto, user, options);
    }

    transformExistent(userDto: UserDto, user: User, options?: object): User {
        user.username = userDto.username ?? user.username;
        user.email = userDto.email ?? user.email;
        user.cin = userDto.cin ?? user.cin;
        user.prefix = userDto.prefix ?? user.prefix;
        user.firstName = userDto.firstName ?? user.firstName;
        user.preferredName = userDto.preferredName ?? user.preferredName;
        user.middleName = userDto.middleName ?? user.middleName;
        user.lastName = userDto.lastName ?? user.lastName;
        user.gender = userDto.gender ?? user.gender;
        user.birthDate = userDto.birthDate ?? user.birthDate;

        if (userDto.phone) {
            user.phone = `${userDto.phone}`;
        }

        if (userDto.address && typeof userDto.address === 'object') {
            user.address = this.addressReversePipe.transformExistent(userDto.address, user.address as Address);
        }

        if (userDto.role) {
            user.role = (userDto.role as RoleDto)?.id || (userDto.role as string);
        }

        return user;
    }

    canTransform(value: UserDto): boolean {
        return true;
    }
}
