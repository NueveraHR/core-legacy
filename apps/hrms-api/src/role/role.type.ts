import { Field, ID, ObjectType, InterfaceType, Int } from '@nestjs/graphql';
import { RoleDto, RolePaginateDto } from '@hrms-core/dto/role.dto';
import { MultipleDeleteResult } from '@hrms-facades/role/role.facade';

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
export class PaginatedRoleList implements Partial<RolePaginateDto> {
    @Field(() => [Role])
    public docs: Role[];

    @Field(() => Int)
    public total: number;

    @Field(() => Int)
    public limit: number;

    @Field(() => Int)
    public pages?: number;

    @Field(() => Int)
    public page?: number;

    @Field(() => Int, { nullable: true })
    nextPage?: number;

    @Field(() => Int, { nullable: true })
    prevPage?: number;
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
