import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginateResult } from 'mongoose';
@ObjectType()
export class RoleDto {
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

export type RolePaginateDto = PaginateResult<RoleDto>;
