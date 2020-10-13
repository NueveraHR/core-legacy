import { Injectable, Inject } from '@nestjs/common';
import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { User } from '@hrms-core/core/user/user.schema';
import { CertificationDto, EducationDto, LanguageDto, UserDto } from '@hrms-core/dto/user.dto';
import { PipTransformException } from '@hrms-core/common/exceptions/pipe-transform.exception';
import { LoggerService } from '@libs/logger';
import { RoleDtoPipe } from '@hrms-core/core/role/pipes/role-dto.pipe';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { SkillDto } from '@hrms-core/dto/skill.dto';
import { SocialLinksDto } from '@hrms-core/dto/social-links.dto';
import { PassportDto } from '@hrms-core/dto/passport.dto';

@Injectable()
export class UserDtoPipe implements DtoTransformPipe<User, UserDto> {
    @Inject(LoggerService) private logger: LoggerService;
    @Inject(RoleDtoPipe) private roleDtoPipe: RoleDtoPipe;

    transform(source: User, options?: {}): UserDto {
        if (!source) {
            this.logger.warn(`Could not transform USer object: Invalid source value given : ${source}`);
            throw new PipTransformException(`Invalid source value given`);
        }

        const userDto: UserDto = {
            id: source.id,
            username: source.username,
            email: source.email,
            firstName: source.firstName,
            preferredName: source.preferredName,
            middleName: source.middleName,
            lastName: source.lastName,
            gender: source.gender,
            birthDate: source.birthDate,
            cin: source.cin,
            prefix: source.prefix,
            phone: source.phone,
            title: source.title,
            about: source.about,
            role: source.role as RoleDto,
            passport: source.passport as PassportDto,
            address: source.address as AddressDto,
            socialLinks: source.socialLinks as SocialLinksDto,
            educationHistory: source.educationHistory as EducationDto[],
            certifications: source.certifications as CertificationDto[],
            languages: source.languages as LanguageDto[],
            skills: source.skills as SkillDto[],
            picture: source.picture,
        };

        return userDto;
    }

    transformExistent(source: User, target: UserDto, options?: any): UserDto {
        return null;
    }

    canTransform(value: User): boolean {
        return true;
    }
}
