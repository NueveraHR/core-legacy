import { UserDto } from '@hrms-core/dto/user.dto';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserCredentials implements Partial<UserDto> {
    @Field()
    email: string;

    @Field()
    password: string;
}
