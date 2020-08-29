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
    public role?: Role;

    @Field()
    public gender?: string;

    @Field(() => Int)
    public phone?: string;

    @Field()
    public modeOfEmployment?: string;

    @Field()
    public department?: string;

    @Field()
    public workEmail?: string;

    @Field()
    public personalEmail?: string;

    @Field()
    public workPhone?: string;

    @Field()
    public personalPhone?: string;

    @Field()
    public homePhone?: string;
}
