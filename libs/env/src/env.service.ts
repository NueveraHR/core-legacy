import * as dotenv from 'dotenv'
import * as fs from 'fs'

export interface EnvData {
    // application
    APP_ENV: string
    APP_DEBUG: boolean

    // database
    DB_TYPE: 'mongodb' | 'mysql'
    DB_HOST?: string
    DB_NAME: string
    DB_PORT?: number
    DB_USER: string
    DB_PASSWORD: string,

    // logger
    LOGGER_FOLDER_PATH: string,
    LOGGER_LEVEL: string,

    // config
    CONFIG_PATH?: string
}

const envFilesPath = './environments';
export class EnvService {
    private vars: EnvData;

    constructor() {
        const environment = process.env.NODE_ENV || 'dev';
        const data: any = dotenv.parse(fs.readFileSync(`${envFilesPath}/${environment}.env`));

        data.APP_ENV = environment;
        data.APP_DEBUG = data.APP_DEBUG === 'true' ? true : false;
        data.DB_PORT = parseInt(data.DB_PORT);

        this.vars = data as EnvData;
    }

    read(): EnvData {
        return this.vars;
    }

    isDev(): boolean {
        return (this.vars.APP_ENV === 'dev');
    }

    isProd(): boolean {
        return (this.vars.APP_ENV === 'prod');
    }

    isTest(): boolean {
        return (this.vars.APP_ENV === 'test');
    }
}