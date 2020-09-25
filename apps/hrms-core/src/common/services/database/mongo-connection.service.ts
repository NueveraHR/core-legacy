import * as mongoose from 'mongoose';
import { EnvService } from '@libs/env';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MongoConnectionService {
    constructor(private envService: EnvService) {}

    /**
     * Create MongoDB connection string based on env data.
     *
     * @returns {string}
     * @memberof DBConnectionManager
     */
    public getConnectionString(): string {
        const envData = this.envService.read();
        const dbParams = {
            host: envData.DB_HOST,
            port: envData.DB_PORT,
            dbName: envData.DB_NAME,
            user: envData.DB_USER,
            password: envData.DB_PASSWORD,
        };

        const prefix = dbParams.user && dbParams.password ? `${dbParams.user}:${dbParams.password}@` : '';
        const connectionString = `mongodb://${prefix}${dbParams.host}:${dbParams.port}/${dbParams.dbName}`;

        return connectionString;
    }

    /**
     * return default DB connection options
     *
     * @returns {mongoose.ConnectionOptions}
     * @memberof DBConnectionManager
     */
    public getConnectionOptions(): mongoose.ConnectionOptions {
        // TODO: load this via env file
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: 'admin',
        };

        return options;
    }
}
