import { Module, Inject } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { CoreModule } from './core/core.module';
import { CommonModule } from './common/common.module';
import { DBConnectionManager } from './common/services/database/connection-manager.service';

import { ConfigManagementModule } from './modules/config-management/config-management.module';
import { AuthModule } from './auth/auth.module';

const connectionManager = new DBConnectionManager();


@Module({
  imports: [
    EnvModule,
    LoggerModule,
    MongooseModule.forRoot(connectionManager.getConnectionString(), connectionManager.getConnectionOptions()),
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    CommonModule,

    AuthModule,
    ConfigManagementModule,
  ],
  exports: [ // We export these modules to expose them in app-module
    AuthModule,
    ConfigManagementModule,
  ]
})
export class HRMSCoreModule { }
