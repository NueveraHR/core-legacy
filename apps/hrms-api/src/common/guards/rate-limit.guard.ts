import { RedisService } from '@hrms-core/common/services/database/redis.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(private reflector: Reflector, private redis: RedisService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context);
        const handlerName = context.getHandler().name;
        const constraints = this.reflector.get('limiterConstraints', context.getHandler()) as LimiterConstraints;
        const { count, failed } = await this.refresh(request, handlerName, constraints);

        if (failed) {
            return false; // This would block all requests, but it's a necessary evil.
        }

        if (count >= constraints.limit) {
            throw new Error('Too many requests ...');
        }

        return true;
    }

    private async refresh(request: any, handlerName: string, constraints: LimiterConstraints) {
        const forwarded = request.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(/, /)[0] : request.ip;
        const id = `${ip}@${handlerName}`;
        let failed = false;
        let count: number;

        try {
            count = await this.redis.incr(id);
            if (count == 1) {
                // set expire.
                this.redis.expire(id, constraints.timeInterval);
            }
        } catch (error) {
            failed = true;
        }

        return { id: id, count: count, failed: failed };
    }

    private getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }
}

export interface LimiterConstraints {
    limit: number;
    timeInterval: number; // TODO: user string with ms lib.
}
