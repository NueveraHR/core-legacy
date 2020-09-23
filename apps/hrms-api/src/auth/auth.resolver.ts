import { Resolver, Mutation, Args, Context, GraphQLExecutionContext } from '@nestjs/graphql';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';
import { AuthenticationError } from 'apollo-server';
import { EnvData, EnvService } from '@libs/env';

@Resolver()
export class AuthResolver {
    constructor(private authFacade: AuthFacade, private envService: EnvService) {}

    @Mutation(() => AuthPayload)
    login(@Context() context: GraphQLExecutionContext, @Args('credentials') credentials: UserCredentials): unknown {
        const res = (context as any).res;
        return this.authFacade
            .auth(credentials)
            .then(authDto => {
                const env = this.envService.read();
                const authCookie = `Authentication=${authDto.token}; HttpOnly; ${
                    this.envService.isProd() ? 'secure;' : ''
                } Path=/; Max-Age=${env.JWT_EXPIRESIN}`;

                res.setHeader('Set-Cookie', authCookie);
                return authDto;
            })
            .catch(err => new AuthenticationError(err.message));
    }
}
