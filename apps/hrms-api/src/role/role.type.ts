import { Field, ID, ObjectType, InterfaceType } from '@nestjs/graphql';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { MultipleDeleteResult } from '@hrms-core/facades/role.facade';

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

    @Field(() => [String], { nullable: true })
    public extendsRoles?: string[];
}
@ObjectType()
export class DeleteResult implements Partial<MultipleDeleteResult> {
    @Field(() => [String])
    accepted: string[] = [];

    @Field(() => [String])
    failed: string[] = [];

    @Field()
    errors: string;
}
