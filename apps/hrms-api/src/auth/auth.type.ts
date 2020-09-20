import { AuthDto } from '@hrms-core/auth/auth.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload implements Partial<AuthDto> {
    @Field()
    token: string;

    @Field()
    userId: string;

    @Field()
    userType: string;

    @Field()
    picture: string;

    @Field()
    gender: string;
}
