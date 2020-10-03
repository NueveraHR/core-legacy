import { RoleDto } from './role.dto';
import { AddressDto } from './address.dto';
import { SkillDto } from './skill.dto';

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
    public address?: AddressDto | string;
    public role?: RoleDto | string;

    public modeOfEmployment?: string;
    public department?: string;

    public picture?: string;
    public title?: string;
    public about?: string;

    public educationHistory?: EducationDto[];
    public certifications?: CertificationDto[];
    public languages?: LanguageDto[];
    public skills?: SkillDto[];
}

export class EducationDto {
    school?: string;
    degree?: string;
    field?: string;
    startYear?: Date;
    endYear?: Date;
    description?: string;
}

export class CertificationDto {
    name?: string;
    issuingOrganization?: string;
    date?: Date;
    expiresOn?: Date;
}

export class LanguageDto {
    name?: string;
    proficiency?: string;
    isPreferred?: boolean;
}
