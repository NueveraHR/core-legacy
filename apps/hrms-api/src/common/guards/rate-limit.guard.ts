import { RedisService } from '@hrms-core/common/services/database/redis.service';
import { LoggerService } from '@libs/logger';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as ms from 'ms';

@Injectable()
export class RateLimitGuard implements CanActivate {
    constructor(private reflector: Reflector, private redis: RedisService, private logger: LoggerService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = this.getRequest(context);
        const contextMetadata = this.getContextMetadata(context);
        const handlerRateState = await this.refresh(
            request,
            contextMetadata.handlerName,
            contextMetadata.handlerConstraints,
        );
        const resolverRateState = await this.refresh(
            request,
            contextMetadata.resolverName,
            contextMetadata.resolverConstraints,
        );

        if (handlerRateState.failed) {
            /* https://community.microfocus.com/t5/Security-Blog/Security-Fundamentals-Part-1-Fail-Open-vs-Fail-Closed/ba-p/283747 */
            return contextMetadata.handlerConstraints.failClosed ?? false;
        }

        if (resolverRateState.failed) {
            return contextMetadata.resolverConstraints.failClosed ?? false;
        }

        if (
            handlerRateState.count > contextMetadata.handlerConstraints?.limit ||
            resolverRateState.count > contextMetadata.resolverConstraints?.limit
        ) {
            throw new Error('Too many requests ...');
        }

        return true;
    }

    private async refresh(request: any, handlerName: string, constraints: LimiterConstraints) {
        if (!handlerName || !constraints) {
            return {};
        }

        const forwarded = request.headers['x-forwarded-for'];
        const ip = forwarded ? forwarded.split(/, /)[0] : request.ip;
        const id = `${ip}@${handlerName}`;
        let failed = false;
        let count: number;

        try {
            count = await this.redis.incr(id);
            if (count == 1) {
                // set expire.
                const interval = this.timeIntervalInSeconds(constraints.timeInterval);
                this.redis.expire(id, interval);
            }
        } catch (error) {
            failed = true;
        }

        return { id, count, failed };
    }

    private getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    private getContextMetadata(context: ExecutionContext): ContextMetadata {
        const handlerName = context.getHandler().name;
        const resolverName = context.getClass().name;
        const handlerConstraints = this.reflector.get('limiterConstraints', context.getHandler()) as LimiterConstraints;
        const resolverConstraints = this.reflector.get('limiterConstraints', context.getClass()) as LimiterConstraints;

        return {
            resolverName,
            handlerName,
            handlerConstraints,
            resolverConstraints,
        };
    }

    private timeIntervalInSeconds(interval: string) {
        if (interval) {
            return ms(interval) / 1000;
        } else {
            this.logger.error(`Invalid time interval ${interval}`);
            return 0;
        }
    }
}

export interface ContextMetadata {
    resolverName: string;
    handlerName: string;
    handlerConstraints: LimiterConstraints;
    resolverConstraints: LimiterConstraints;
}

export interface LimiterConstraints {
    limit?: number;
    timeInterval?: string;
    failClosed?: boolean;
}
