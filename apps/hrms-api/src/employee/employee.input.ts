import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { InputType, Field, ID, Int } from '@nestjs/graphql';

@InputType()
export class AddEmployeeInput implements Partial<EmployeeDto> {
    @Field()
    public email: string;

    @Field()
    public firstName: string;

    @Field()
    public lastName: string;

    @Field(() => Int)
    public cin: string;

    @Field()
    public prefix: string;

    @Field(() => ID)
    public roleId: string;

    @Field()
    public gender: string;

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
