import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { UserDto } from '@hrms-core/user/user.dto';
import { User } from '@hrms-core/user/user.schema';
import { Injectable } from '@nestjs/common';
import { RoleDto } from '@hrms-core/role/role.dto';
import { Address } from '@hrms-core/address/address.schema';
import { AddressReversePipe } from '@hrms-core/address/pipes/address-reverse.pipe';
import { SocialLinksReversePipe } from '../social-links/social-links-reverse.pipe';
import { SocialLinks } from '../social-links/social-links.schema';
import { SocialLinksDto } from '@hrms-core/user/social-links/social-links.dto';

@Injectable()
export class UserDtoReversePipe implements DtoTransformPipe<UserDto, User> {
    constructor(
        private addressReversePipe: AddressReversePipe,
        private socialLinksReversePipe: SocialLinksReversePipe,
    ) {}

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
        user.nationality = userDto.nationality ?? user.nationality;
        user.birthDate = userDto.birthDate ?? user.birthDate;
        user.title = userDto.title ?? user.title;
        user.about = userDto.about ?? user.about;

        if (userDto.phone) {
            user.phone = `${userDto.phone}`;
        }

        if (userDto.address && typeof userDto.address === 'object') {
            user.address = this.addressReversePipe.transformExistent(userDto.address, user.address as Address);
        }

        if (userDto.socialLinks && typeof userDto.socialLinks === 'object') {
            user.socialLinks = this.socialLinksReversePipe.transformExistent(
                userDto.socialLinks as SocialLinksDto,
                user.socialLinks as SocialLinks,
            );
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
