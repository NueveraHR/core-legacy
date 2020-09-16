import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { Role } from '@hrms-api/role/role.type';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { JobDto } from '@hrms-core/dto/job.dto';

@InputType()
export class AddAddressInput implements Partial<AddressDto> {
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

@InputType()
export class UpdateAddressInput implements Partial<AddressDto> {
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

@InputType()
export class AddEmployeeInput implements Partial<EmployeeDto> {
    @Field()
    public email: string;

    @Field()
    public firstName: string;

    @Field({ nullable: true })
    public preferredName?: string;

    @Field({ nullable: true })
    public middleName?: string;

    @Field()
    public lastName: string;

    @Field()
    public cin: string;

    @Field()
    public prefix: string;

    @Field(() => ID)
    public role: Role | string;

    @Field()
    public gender: string;

    @Field(() => Date)
    public birthDate: Date;

    @Field(() => AddAddressInput)
    public address: AddAddressInput;

    @Field()
    public phone: string;

    @Field({ nullable: true, description: 'Optional, default is the email prefix' })
    public username: string;

    @Field({ nullable: true, description: 'Optional, default will be generated' })
    public password: string;

    @Field({ nullable: true })
    public workEmail: string;

    @Field({ nullable: true })
    public personalEmail: string;

    @Field({ nullable: true })
    public workPhone: string;

    @Field({ nullable: true })
    public personalPhone: string;

    @Field({ nullable: true })
    public homePhone: string;

    // public modeOfEmployment: string;
    // public department: string;
}

@InputType()
export class UpdateEmployeeInput implements Partial<EmployeeDto> {
    @Field(() => ID)
    public id: string;

    @Field({ nullable: true })
    public email: string;

    @Field({ nullable: true })
    public firstName: string;

    @Field({ nullable: true })
    public preferredName?: string;

    @Field({ nullable: true })
    public middleName?: string;

    @Field(() => ID, { nullable: true })
    public role: Role | string;

    @Field({ nullable: true })
    public lastName: string;

    @Field({ nullable: true })
    public cin: string;

    @Field({ nullable: true })
    public prefix: string;

    @Field({ nullable: true })
    public gender: string;

    @Field({ nullable: true })
    public birthDate: Date;

    @Field({ nullable: true })
    public address: UpdateAddressInput;

    @Field({ nullable: true })
    public phone: string;

    @Field({ nullable: true })
    public username: string;

    @Field({ nullable: true })
    public password: string;

    @Field({ nullable: true })
    public workEmail: string;

    @Field({ nullable: true })
    public personalEmail: string;

    @Field({ nullable: true })
    public workPhone: string;

    @Field({ nullable: true })
    public personalPhone: string;

    @Field({ nullable: true })
    public homePhone: string;
}

@InputType()
export class JobInput implements Partial<JobDto> {
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
