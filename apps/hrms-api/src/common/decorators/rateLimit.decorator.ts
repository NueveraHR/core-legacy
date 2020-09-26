import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { LimiterConstraints } from '../guards/rate-limit.guard';

/**
 * Limit number of requests in a time interval
 * @param options
 */
export const RateLimit = (constraints: LimiterConstraints) => SetMetadata('limiterConstraints', constraints);
