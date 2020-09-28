import { Role } from '@hrms-api/role/role.type';
import { AuthDto } from '@hrms-core/auth/auth.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload implements Partial<AuthDto> {
    @Field()
    userType?: string;

    @Field()
    id?: string;

    @Field()
    username?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    middleName?: string;

    @Field()
    lastName?: string;

    @Field()
    email?: string;

    @Field(() => Role)
    role?: Role | string;

    @Field()
    gender?: string;

    @Field()
    picture?: string;
}
