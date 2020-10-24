import {
    Resolver,
    Mutation,
    Args,
    Context,
    GraphQLExecutionContext,
    Query,
} from '@nestjs/graphql';
import { AuthFacade } from '@hrms-facades/auth/auth.facade';
import { UserCredentials } from './auth.input';
import { AuthPayload } from './auth.type';
import { AuthenticationError } from 'apollo-server';
import { EnvService } from '@libs/env';
import * as ms from 'ms';
import { RateLimit } from '@hrms-api/common/decorators/rateLimit.decorator';
import { UseGuards } from '@nestjs/common';
import { RateLimitGuard } from '@hrms-api/common/guards/rate-limit.guard';
import { GqlError } from '@hrms-api/common/utils/error.utils';
import { RegisterFacade } from '@hrms-facades/auth/register.facade';
import { RestoreAccountFacade } from '@hrms-facades/auth/restore-account.facade';

@Resolver()
@UseGuards(RateLimitGuard)
export class AuthResolver {
    constructor(
        private authFacade: AuthFacade,
        private registerFacade: RegisterFacade,
        private restoreAccountFacade: RestoreAccountFacade,
        private envService: EnvService,
    ) {}

    @Mutation(() => AuthPayload)
    @RateLimit({ limit: 7, timeInterval: '1m', failClosed: true })
    login(
        @Context() context: GraphQLExecutionContext,
        @Args('credentials') credentials: UserCredentials,
    ): unknown {
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

    @Query(() => Boolean)
    validateToken(
        @Args('token') token: string,
        @Args('restore', { type: () => Boolean, nullable: true }) restore = false,
    ): Promise<any> {
        if (restore) {
            return this.restoreAccountFacade.validateToken(token).catch(GqlError);
        }
        return this.registerFacade.validateToken(token).catch(GqlError);
    }

    @Mutation(() => Boolean)
    activateAccount(
        @Args('token') token: string,
        @Args('password') password: string,
    ): unknown {
        return this.registerFacade.activateAccount(token, password).catch(GqlError);
    }

    @Mutation(() => Boolean)
    requestResetPassword(@Args('email') email: string): Promise<any> {
        return this.restoreAccountFacade.reserveRequest(email).catch(GqlError);
    }

    @Mutation(() => Boolean)
    resetPassword(
        @Args('token') token: string,
        @Args('newPassword') password: string,
    ): Promise<any> {
        return this.restoreAccountFacade.restore(token, password).catch(GqlError);
    }

    private getMaxAge(expiresIn: string): any {
        return expiresIn ? ms(expiresIn) : '';
    }
}
