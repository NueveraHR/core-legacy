import { Field, ID, InputType } from '@nestjs/graphql';
import { RoleDto } from '@hrms-core/dto/role.dto';

@InputType()
export class AddRoleInput implements Partial<RoleDto> {
    @Field()
    public name?: string;

    @Field()
    public description?: string;

    @Field(() => [String])
    public privileges?: string[];

    @Field(() => [String], { nullable: true })
    public extendsRoles?: string[];
}

@InputType()
export class UpdateRoleInput extends AddRoleInput {
    @Field(() => ID)
    public id: string;
}
