import { Resolver, Mutation, Args, Context, GraphQLExecutionContext } from '@nestjs/graphql';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';
import { AuthenticationError } from 'apollo-server';
import { EnvData, EnvService } from '@libs/env';
import * as ms from 'ms';

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
                const options = {
                    maxAge: this.getMaxAge(env.JWT_EXPIRESIN),
                    secure: this.envService.isProd(),
                    httpOnly: true,
                };

                res.cookie('Authentication', authDto.token, options);
                return authDto;
            })
            .catch(err => new AuthenticationError(err.message));
    }

    private getMaxAge(expiresIn: string): any {
        return expiresIn ? ms(expiresIn) : '';
    }
}
