import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { AuthenticationError } from 'apollo-server';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
    public constructor(private readonly reflector: Reflector) {
        super();
    }

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

        if (isPublic) {
            return true;
        }

        // Make sure to check the authorization, for now, just return false to have a difference between public routes.
        try {
            return (await super.canActivate(context)) as boolean;
        } catch (e) {
            throw new AuthenticationError('You are not authorized to access this resource');
        }
    }
}
