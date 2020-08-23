import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { UserDto } from '@hrms-core/dto/user.dto';
import { User } from '@hrms-core/core/user/user.schema';
import { Injectable } from '@nestjs/common';

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
        user.lastName = userDto.lastName;
        user.gender = userDto.gender;
        user.phone = `${userDto.phone}`;
        user.role = userDto.role;

        return user;
    }

    canTransform(value: UserDto): boolean {
        return true;
    }
}
