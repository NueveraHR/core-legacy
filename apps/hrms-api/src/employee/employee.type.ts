import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { Role } from '@hrms-api/role/role.type';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { UserPaginateDto } from '@hrms-core/facades/user.facade';
import { JobDto } from '@hrms-core/dto/job.dto';

@ObjectType()
export class Address implements Partial<AddressDto> {
    @Field()
    addressLine1?: string;

    @Field({ nullable: true })
    addressLine2?: string;

    @Field()
    city?: string;

    @Field()
    state?: string;

    @Field()
    country?: string;

    @Field()
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

    public password?: string;

    @Field()
    public email?: string;

    @Field()
    public cin?: string;

    @Field()
    public prefix?: string;

    @Field(() => Role)
    public role?: Role | string;

    @Field()
    public gender?: string;

    @Field(() => Date)
    public birthDate?: Date;

    @Field(() => Address)
    public address?: Address | string;

    @Field()
    public phone?: string;

    @Field()
    public modeOfEmployment?: string;

    @Field()
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

    @Field(() => [Job], { nullable: true })
    public jobHistory?: Job[];
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
