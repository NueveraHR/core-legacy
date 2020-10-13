import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { Role } from '@hrms-api/role/role.type';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { UserPaginateDto } from '@hrms-core/facades/user.facade';
import { JobDto } from '@hrms-core/dto/job.dto';
import { CertificationDto, EducationDto, LanguageDto } from '@hrms-core/dto/user.dto';
import { SkillDto } from '@hrms-core/dto/skill.dto';
import { SocialLinksDto } from '@hrms-core/dto/social-links.dto';
import { PassportDto } from '@hrms-core/dto/passport.dto';

@ObjectType()
export class Passport implements Partial<PassportDto> {
    @Field()
    number?: string;

    @Field(() => Date)
    issueDate?: Date;
}

@ObjectType()
export class SocialLinks implements Partial<SocialLinksDto> {
    @Field({ nullable: true })
    linkedIn?: string;

    @Field({ nullable: true })
    whatsApp?: string;

    @Field({ nullable: true })
    facebook?: string;

    @Field({ nullable: true })
    github?: string;

    @Field({ nullable: true })
    stackOverflow?: string;
}

@ObjectType()
export class Skill implements Partial<SkillDto> {
    @Field()
    name?: string;

    @Field({ nullable: true })
    level?: number;

    @Field({ nullable: true })
    ref?: string;

    //TODO: expose related fields
}

@ObjectType()
export class Education implements Partial<EducationDto> {
    @Field(() => ID)
    id?: string;

    @Field()
    school?: string;

    @Field()
    degree?: string;

    @Field()
    field?: string;

    @Field(() => Date)
    startYear?: Date;

    @Field(() => Date, { nullable: true })
    endYear?: Date;

    @Field({ nullable: true })
    description?: string;
}

@ObjectType()
export class Certification implements Partial<CertificationDto> {
    @Field(() => ID)
    id?: string;

    @Field()
    name?: string;

    @Field()
    issuingOrganization?: string;

    @Field(() => Date)
    date?: Date;

    @Field(() => Date, { nullable: true })
    expiresOn?: Date;
}

@ObjectType()
export class Language implements Partial<LanguageDto> {
    @Field(() => ID)
    id?: string;

    @Field()
    name?: string;

    @Field()
    proficiency?: string;

    @Field()
    isPreferred?: boolean;
}

@ObjectType()
export class Address implements Partial<AddressDto> {
    @Field({ nullable: true })
    addressLine1?: string;

    @Field({ nullable: true })
    addressLine2?: string;

    @Field({ nullable: true })
    city?: string;

    @Field({ nullable: true })
    state?: string;

    @Field({ nullable: true })
    country?: string;

    @Field({ nullable: true })
    postalCode?: string;
}

@ObjectType()
export class Job implements Partial<JobDto> {
    @Field(() => ID)
    id?: string;

    @Field()
    title?: string;

    @Field()
    employmentType?: string;

    @Field(() => Date)
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    endDate?: Date;

    @Field()
    location?: string;

    @Field()
    description?: string;

    @Field({ nullable: true })
    department?: string;

    @Field(() => Float, { nullable: true })
    salary?: number;

    @Field({ nullable: true })
    salaryFrequency?: string;

    @Field({ nullable: true })
    salaryCurrency?: string;

    @Field(() => Float, { nullable: true })
    hoursPerWeek?: number;

    @Field(() => Float, { nullable: true })
    bonusEarnings?: number;

    @Field({ nullable: true })
    bonusFrequency?: string;
}

@ObjectType()
export class Employee implements Partial<EmployeeDto> {
    @Field(() => ID)
    public id?: string;

    @Field()
    public username?: string;

    @Field()
    public firstName?: string;

    @Field({ nullable: true })
    public preferredName?: string;

    @Field({ nullable: true })
    public middleName?: string;

    @Field()
    public lastName?: string;

    @Field()
    public email?: string;

    @Field({ nullable: true })
    public cin?: string;

    @Field()
    public prefix?: string;

    @Field(() => Role)
    public role?: Role | string;

    @Field()
    public gender?: string;

    @Field({ nullable: true })
    public nationality?: string;

    @Field(() => Date, { nullable: true })
    public birthDate?: Date;

    @Field(() => Passport, { nullable: true })
    public passport?: Passport | string;

    @Field(() => Address, { nullable: true })
    public address?: Address | string;

    @Field({ nullable: true })
    public phone?: string;

    @Field({ nullable: true })
    public title?: string;

    @Field({ nullable: true })
    public about?: string;

    @Field({ nullable: true })
    public modeOfEmployment?: string;

    @Field({ nullable: true })
    public department?: string;

    @Field({ nullable: true })
    public workEmail?: string;

    @Field({ nullable: true })
    public personalEmail?: string;

    @Field({ nullable: true })
    public workPhone?: string;

    @Field({ nullable: true })
    public personalPhone?: string;

    @Field({ nullable: true })
    public homePhone?: string;

    @Field({ nullable: true })
    public picture?: string;

    @Field(() => SocialLinks, { nullable: true })
    public socialLinks?: SocialLinks;

    @Field(() => [Skill], { nullable: true })
    public skills: Skill[];

    @Field(() => [Job], { nullable: true })
    public jobHistory?: Job[];

    @Field(() => [Education], { nullable: true })
    public educationHistory?: Education[];

    @Field(() => [Certification], { nullable: true })
    public certifications?: Certification[];

    @Field(() => [Language], { nullable: true })
    public languages?: Language[];
}

@ObjectType()
export class PaginatedEmployeeList implements Partial<UserPaginateDto> {
    @Field(() => [Employee])
    public docs: Employee[];

    @Field(() => Int)
    public total: number;

    @Field(() => Int)
    public limit: number;

    @Field(() => Int)
    public pages?: number;

    @Field(() => Int)
    public page?: number;

    @Field(() => Int, { nullable: true })
    nextPage?: number;

    @Field(() => Int, { nullable: true })
    prevPage?: number;
}
