import { ErrorMessage } from '@hrms-core/common/error/error.const';
import { Injectable } from '@nestjs/common';
import { EnvService } from '@libs/env';
import { LoggerService } from '@libs/logger';

@Injectable()
export class ErrorService {
    constructor(private envService: EnvService, private loggerService: LoggerService) {}

    generate(statusCode: number, options?: { message?: string; detailedMessage?: any }): ErrorDto {
        const errorDto: ErrorDto = {};

        if (!options?.message) {
            errorDto.message = ErrorMessage[statusCode];
        }

        errorDto.statusCode = statusCode;
        if (!this.envService.isProd()) {
            errorDto.detailedMessage = options?.detailedMessage;
        }

        if (errorDto.statusCode.toString().startsWith('5')) {
            this.loggerService.error(`[${errorDto.statusCode}] ${errorDto.message} :: ${options?.detailedMessage}`);
        } else {
            this.loggerService.info(`[${errorDto.statusCode}] ${errorDto.message}`);
        }

        return errorDto;
    }

    isError(data: unknown): boolean {
        return data['statusCode'] && data['message'];
    }
}

export interface ErrorDto {
    statusCode?: number;
    message?: string;
    detailedMessage?: any;
}
