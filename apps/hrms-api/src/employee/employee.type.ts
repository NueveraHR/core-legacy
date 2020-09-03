import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { Role } from '@hrms-api/role/role.type';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { UserPaginateDto } from '@hrms-core/facades/user.facade';

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

    @Field(() => Int)
    public offset?: number;
}
