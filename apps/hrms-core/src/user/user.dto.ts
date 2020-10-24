import { RoleDto } from '../role/role.dto';
import { AddressDto } from '../address/address.dto';
import { SkillDto } from './skill/skill.dto';
import { SocialLinksDto } from './social-links/social-links.dto';
import { PassportDto } from './passport/passport.dto';
import { JobDto } from '../job/job.dto';
import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { NvrPaginateResult } from '@hrms-core/common/interfaces/pagination';

export class UserDto {
    public id?: string;

    public type?: UserType;
    public username?: string;
    public email?: string;
    public cin?: string;
    public prefix?: string;
    public firstName?: string;
    public preferredName?: string;
    public middleName?: string;
    public lastName?: string;
    public gender?: string;
    public nationality?: string;
    public birthDate?: Date;

    public password?: string;
    public phone?: string;
    public homePhone?: string;
    public passport?: PassportDto | string;
    public address?: AddressDto | string;
    public role?: RoleDto | string;

    public modeOfEmployment?: string;
    public department?: string;

    public picture?: string;
    public title?: string;
    public about?: string;
    public accountActivated?: boolean;

    public socialLinks?: string | SocialLinksDto;
    public educationHistory?: EducationDto[] | string[];
    public certifications?: CertificationDto[] | string[];
    public languages?: LanguageDto[] | string[];
    public skills?: SkillDto[] | string[];
    public jobHistory?: JobDto[] | string[];
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
    proficiency?: number;
    isPreferred?: boolean;
}

export type UserPaginateDto = NvrPaginateResult<UserDto>;
