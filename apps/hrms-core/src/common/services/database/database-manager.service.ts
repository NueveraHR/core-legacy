import { Injectable } from "@nestjs/common";
import { Connection, Collection } from "mongoose";
import { InjectConnection } from "@nestjs/mongoose";
import { EnvService } from "@libs/env";

@Injectable()
export class DBManager {

    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly envService: EnvService
    ) {

    }

    /**
     * Drop all database collections
     * This is possible for test environments only
     *
     * @memberof DBManager
     */
    public async dropDatabaseCollections() {
        if (this.envService.isTest()) {
            const collections = this.connection.collections;
            for (const key in collections) {
                const collection = collections[key];
                await collection.remove({})
            }
        }
    }
}