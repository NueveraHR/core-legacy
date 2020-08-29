import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoleDto } from '@hrms-core/dto/role.dto';

@ObjectType()
export class Role implements Partial<RoleDto> {
    @Field(() => ID)
    public id?: string;

    @Field()
    public name?: string;

    @Field()
    public description?: string;

    @Field(() => [String])
    public privileges?: string[];

    @Field(() => [String])
    public extendsRoles?: string[];
}
