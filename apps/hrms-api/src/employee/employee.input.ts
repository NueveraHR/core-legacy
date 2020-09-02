import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { Role } from '@hrms-api/role/role.type';
import { AddressDto } from '@hrms-core/dto/address.dto';

@InputType()
export class AddressInput implements Partial<AddressDto> {
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

    @Field(() => AddressInput)
    public address: AddressInput;

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
export class UpdateEmployeeInput implements Partial<EmployeeDto> {}
