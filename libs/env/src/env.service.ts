import * as dotenv from 'dotenv';
import * as fs from 'fs';

export interface EnvData {
    // application
    APP_ENV: string;
    APP_DEBUG: boolean;

    // database
    DB_TYPE: 'mongodb' | 'mysql';
    DB_HOST?: string;
    DB_NAME: string;
    DB_PORT?: number;
    DB_USER: string;
    DB_PASSWORD: string;

    // logger
    LOGGER_FOLDER_PATH: string;
    LOGGER_LEVEL: string;

    // config
    CONFIG_PATH?: string;

    JWT_SECRETKEY?: string;
    JWT_EXPIRESIN?: string;

    // Imgpush url
    IMGPUSH_URL?: string;

    // General
    COMPANY_NAME?: string;

    // Mailer
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_SECURE?: boolean;

    // Register user
    REGISTER_USER_URL?: string;
}

const envFilesPath = './environments';
export class EnvService {
    private vars: EnvData;

    constructor() {
        const environment = process.env.NODE_ENV || 'dev';
        const data: any = dotenv.parse(
            fs.readFileSync(`${envFilesPath}/${environment}.env`),
        );

        data.APP_ENV = environment;
        data.APP_DEBUG = data.APP_DEBUG === 'true' ? true : false;
        data.SMTP_SECURE = data.SMTP_SECURE === 'true' ? true : false;
        data.DB_PORT = parseInt(data.DB_PORT);
        data.SMTP_PORT = parseInt(data.SMTP_PORT);

        this.vars = data as EnvData;
        // console.log(`:::::::::::: Started application using environment ${environment} ::::::::::::`);
    }

    read(): EnvData {
        return this.vars;
    }

    isDev(): boolean {
        return this.vars.APP_ENV === 'dev';
    }

    isProd(): boolean {
        return this.vars.APP_ENV === 'prod';
    }

    isTest(): boolean {
        return this.vars.APP_ENV.indexOf('test') != -1;
    }
}
