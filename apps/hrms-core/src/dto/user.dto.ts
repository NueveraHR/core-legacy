import { RoleDto } from './role.dto';
import { AddressDto } from './address.dto';
import { SkillDto } from './skill.dto';
import { SocialLinksDto } from './social-links.dto';
import { PassportDto } from './passport.dto';

export class UserDto {
    public id?: string;

    public username?: string;
    public email?: string;
    public cin?: string;
    public prefix?: string;
    public firstName?: string;
    public preferredName?: string;
    public middleName?: string;
    public lastName?: string;
    public gender?: string;
    public birthDate?: Date;

    public password?: string;
    public phone?: string;
    public passport?: PassportDto | string;
    public address?: AddressDto | string;
    public role?: RoleDto | string;

    public modeOfEmployment?: string;
    public department?: string;

    public picture?: string;
    public title?: string;
    public about?: string;

    public socialLinks?: string | SocialLinksDto;
    public educationHistory?: EducationDto[] | string[];
    public certifications?: CertificationDto[] | string[];
    public languages?: LanguageDto[] | string[];
    public skills?: SkillDto[] | string[];
}

export class EducationDto {
    id?: string;
    school?: string;
    degree?: string;
    field?: string;
    startYear?: Date;
    endYear?: Date;
    description?: string;
}

export class CertificationDto {
    id?: string;
    name?: string;
    issuingOrganization?: string;
    date?: Date;
    expiresOn?: Date;
}

export class LanguageDto {
    id?: string;
    name?: string;
    proficiency?: string;
    isPreferred?: boolean;
}
