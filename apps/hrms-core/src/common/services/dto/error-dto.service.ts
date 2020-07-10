import { ErrorMessage } from "@hrms-core/common/consts/error.const";
import { Inject, Injectable } from "@nestjs/common";
import { EnvService } from "@libs/env";
import { LoggerService } from "@libs/logger";

@Injectable()
export class DtoService {

    constructor(
        private envService: EnvService,
        private loggerService: LoggerService,
    ) { }

    error(statusCode: number, options?: { message?: string, detailedMessage?: any }) {
        const errorDto: ErrorDto = {

        };

        if (!options?.message) {
            errorDto.message = ErrorMessage[statusCode];
        }

        errorDto.statusCode = statusCode;
        if (!this.envService.isProd()) {
            errorDto.detailedMessage = options?.detailedMessage;
        }

        this.loggerService.error({ statusCode, options });

        return errorDto;
    }


    isInstance(data: any): boolean {
        return (data?.code && data?.message);
    }
}

export interface ErrorDto {
    statusCode?: number;
    message?: string;
    detailedMessage?: any;
}