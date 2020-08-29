import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { RoleDto } from './role.dto';

@ObjectType()
export class UserDto {
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

    @Field(() => RoleDto)
    public role?: RoleDto;

    @Field()
    public gender?: string;

    @Field(() => Int)
    public phone?: number;

    @Field()
    public modeOfEmployment?: string;

    @Field()
    public department?: string;
}
