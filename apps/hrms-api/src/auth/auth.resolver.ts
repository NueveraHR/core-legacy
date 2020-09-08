import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';
import { AuthenticationError } from 'apollo-server';

@Resolver()
export class AuthResolver {
    constructor(private authFacade: AuthFacade) {}

    @Mutation(() => AuthPayload)
    login(@Args('credentials') credentials: UserCredentials) {
        return this.authFacade.auth(credentials).catch(err => new AuthenticationError(err.message));
    }
}
