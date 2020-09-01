import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { Role } from '@hrms-api/role/role.type';

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
    public birthDate: Date;

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
