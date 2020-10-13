import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { CommonModule } from './common/common.module';
import { MongoConnectionService } from './common/services/database/mongo-connection.service';

import { HRMSConfigModule } from '@libs/config';
import { DocumentModule } from './document/document.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { JobModule } from './job/job.module';
import { JobFieldModule } from './job-field/job-field.module';

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
        HRMSConfigModule,
        DocumentModule,
        RoleModule,
        UserModule,
        JobModule,
        JobFieldModule,
    ],
    exports: [
        // We export these modules to expose them in facades-module
        HRMSConfigModule,
        DocumentModule,
        RoleModule,
        UserModule,
        JobModule,
        JobFieldModule,
        EnvModule,
        LoggerModule,
    ],
})
export class HRMSCoreModule {}
