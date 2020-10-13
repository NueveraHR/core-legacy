import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { CommonModule } from './common/common.module';
import { MongoConnectionService } from './common/services/database/mongo-connection.service';

import { CoreModule } from './core/core.module';

@Module({
    imports: [
        EnvModule,
        LoggerModule,
        MongooseModule.forRootAsync({
            imports: [CommonModule],
            useFactory: (mongoConnectionService: MongoConnectionService) => ({
                uri: mongoConnectionService.getConnectionString(),
                ...mongoConnectionService.getConnectionOptions(),
            }),
            inject: [MongoConnectionService],
        }),

        CommonModule,
        ConfigModule.forRoot({ isGlobal: true }),
        CoreModule,
    ],
    exports: [
        // We export these modules to expose them in facades-module
        CoreModule,
        EnvModule,
        LoggerModule,
    ],
})
export class HRMSCoreModule {}
