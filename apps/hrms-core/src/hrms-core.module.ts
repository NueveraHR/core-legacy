import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule, EnvService } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { CommonModule } from './common/common.module';
import { MongoConnectionService } from './common/services/database/mongo-connection.service';

import { AuthModule } from './auth/auth.module';
import { FacadesModule } from './facades/facades.module';
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

        AuthModule,
        FacadesModule,
    ],
    exports: [
        // We export these modules to expose them in app-module
        AuthModule,
        CoreModule, // TODO: Remove after exposing document facade
        FacadesModule,
    ],
})
export class HRMSCoreModule {}
