import { Resolver, Mutation, Args, Context, GraphQLExecutionContext } from '@nestjs/graphql';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';
import { AuthenticationError } from 'apollo-server';

@Resolver()
export class AuthResolver {
    constructor(private authFacade: AuthFacade) {}

    @Mutation(() => AuthPayload)
    login(@Context() context: GraphQLExecutionContext, @Args('credentials') credentials: UserCredentials): unknown {
        const res = (context as any).res;
        return this.authFacade
            .auth(credentials)
            .then(authDto => {
                res.setHeader('Set-Cookie', authDto.tokenCookie);
                delete authDto.tokenCookie;
                return authDto;
            })
            .catch(err => new AuthenticationError(err.message));
    }
}
