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

        this.winstonLoggerInstance = winston.createLogger({
            level: this.envService.read().LOGGER_LEVEL || 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: path.join(this.loggerFolderPath, this.loggerFileName) })
            ],
        });
    }

    debug(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.debug(`${logDate} : ${message}`);
    }

    error(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.error(`${logDate} : ${message}`);
    }

    info(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.info(`${logDate} : ${message}`);
    }

    http(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.http(`${logDate} : ${message}`);
    }

    silly(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.silly(`${logDate} : ${message}`);
    }

    verbose(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.verbose(`${logDate} : ${message}`);
    }

    warn(message) {
        const logDate = new Date().toISOString();
        this.winstonLoggerInstance.warn(`${logDate} : ${message}`);
    }

}