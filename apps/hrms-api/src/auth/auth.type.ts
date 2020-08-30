import { AuthDto } from '@hrms-core/auth/auth.dto';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload implements Partial<AuthDto> {
    @Field()
    token: string;

    @Field()
    userId: string;

    @Field()
    roleId: string;
}
