import { UserDto } from '@hrms-core/user/user.dto';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCredentials implements Partial<UserDto> {
    @Field()
    email: string;

    @Field()
    password: string;
}
