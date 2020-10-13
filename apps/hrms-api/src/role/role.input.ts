import { Field, ID, InputType } from '@nestjs/graphql';
import { RoleDto } from '@hrms-core/role/role.dto';

@InputType()
export class AddRole implements Partial<RoleDto> {
    @Field()
    name?: string;

    @Field()
    description?: string;

    @Field(() => [String])
    privileges?: string[];

    @Field(() => [String], { nullable: true })
    extendsRoles?: string[];
}

@InputType()
export class UpdateRole extends AddRole {
    @Field(() => ID)
    id: string;
}
