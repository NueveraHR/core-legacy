import { Resolver, Mutation, Args, Context, GraphQLExecutionContext } from '@nestjs/graphql';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';
import { AuthenticationError } from 'apollo-server';
import { EnvService } from '@libs/env';
import * as ms from 'ms';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { UseGuards } from '@nestjs/common';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';

@Resolver()
@UseGuards(RateLimitGuard)
export class AuthResolver {
    constructor(private authFacade: AuthFacade, private envService: EnvService) {}

    @Mutation(() => AuthPayload)
    @RateLimit({ limit: 7, timeInterval: 1 * 60 })
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
