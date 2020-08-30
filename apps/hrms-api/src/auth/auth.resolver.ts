import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';

@Resolver()
export class AuthResolver {
    constructor(private authFacade: AuthFacade) {}

    @Mutation(() => AuthPayload)
    login(@Args('credentials') credentials: UserCredentials): Promise<AuthPayload> {
        return this.authFacade.auth(credentials);
    }
}
