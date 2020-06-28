import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path';
import * as winston from 'winston';

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

const envFilesPath = './environments';
export class LoggerService {

    private vars: LoggerData;
    private loggerFolderPath: string;
    private loggerFileName: string;
    private winstonLoggerInstance: any;

    constructor() {
        const environment = process.env.NODE_ENV || 'dev';
        const data: any = dotenv.parse(fs.readFileSync(`${envFilesPath}/${environment}.env`));

        this.vars = data as LoggerData;
        this.loggerFolderPath = this.vars.LOGGER_FOLDER_PATH || 'logs/';

        if (environment !== 'production') {
            this.loggerFileName = (new Date().getTime()) + '.log';
        } else {
            this.loggerFileName = 'nuevera.log';
        }

        this.winstonLoggerInstance = winston.createLogger({
            level: this.vars.LOGGER_LEVEL || 'info',
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
