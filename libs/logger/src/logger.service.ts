import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path';
import * as winston from 'winston';
import { EnvService } from '@libs/env';
import { Inject } from '@nestjs/common';

export enum LoggerLevel {
    error = 'error',
    warn = 'warn',
    info = 'info',
    http = 'http',
    verbose = 'verbose',
    debug = 'debug',
    silly = 'silly'
}

export interface LoggerData {
    LOGGER_FOLDER_PATH: string;
    LOGGER_LEVEL: LoggerLevel;
}

export class LoggerService {

    private loggerFolderPath: string;
    private loggerFileName: string;
    private winstonLoggerInstance: any;

    constructor(@Inject(EnvService) private readonly envService: EnvService) {

        this.loggerFolderPath = this.envService.read().LOGGER_FOLDER_PATH || 'logs/';

        if (this.envService.isProd()) {
            this.loggerFileName = (new Date().getTime()) + '.log';
        } else {
            this.loggerFileName = 'nuevera.log';
        }

        const myFormat = winston.format.printf(({ level, message,  timestamp }) => {
            return `${level.toUpperCase()} :: ${timestamp} :: ${message}`;
        });

        this.winstonLoggerInstance = winston.createLogger({
            level: this.envService.read().LOGGER_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.errors({ stack: true }), // <-- use errors format
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.prettyPrint(),
                myFormat
            ),
            transports: [
                new winston.transports.File({ filename: path.join(this.loggerFolderPath, this.loggerFileName) }),
                new winston.transports.Console()
            ],
        });
    }

    debug(message) {
        this.winstonLoggerInstance.debug(`${message}`);
    }

    error(message) {
        this.winstonLoggerInstance.error(`${message}`);
    }

    info(message) {
        this.winstonLoggerInstance.info(`${message}`);
    }

    http(message) {
        this.winstonLoggerInstance.http(`${message}`);
    }

    silly(message) {
        this.winstonLoggerInstance.silly(`${message}`);
    }

    verbose(message) {
        this.winstonLoggerInstance.verbose(`${message}`);
    }

    warn(message) {
        this.winstonLoggerInstance.warn(`${message}`);
    }

}
