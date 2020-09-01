import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { UserDto } from '@hrms-core/dto/user.dto';
import { User } from '@hrms-core/core/user/user.schema';
import { Injectable } from '@nestjs/common';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { Address } from '@hrms-core/core/address/address.schema';

@Injectable()
export class UserDtoReversePipe implements DtoTransformPipe<UserDto, User> {
    transform(userDto: UserDto, options?: object): User {
        const user = new User();
        return this.transformExistent(userDto, user, options);
    }

    transformExistent(userDto: UserDto, user: User, options?: object): User {
        user.username = userDto.username;
        user.email = userDto.email;
        user.cin = userDto.cin;
        user.prefix = userDto.prefix;
        user.firstName = userDto.firstName;
        user.preferredName = userDto.preferredName;
        user.middleName = userDto.preferredName;
        user.lastName = userDto.lastName;
        user.gender = userDto.gender;
        user.birthDate = userDto.birthDate;
        user.phone = `${userDto.phone}`;
        user.role = (userDto.role as RoleDto)?.id || (userDto.role as string);
        user.address = (userDto.address as Address).id || userDto.address;
        return user;
    }

    canTransform(value: UserDto): boolean {
        return true;
    }
}
