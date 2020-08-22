import { Module, Inject } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { CommonModule } from './common/common.module';
import { DBConnectionManager } from './common/services/database/connection-manager.service';

import { AuthModule } from './auth/auth.module';
import { FacadesModule } from './facades/facades.module';

const connectionManager = new DBConnectionManager();


@Module({
  imports: [
    EnvModule,
    LoggerModule,
    MongooseModule.forRoot(connectionManager.getConnectionString(), connectionManager.getConnectionOptions()),
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,

    AuthModule,
    FacadesModule
  ],
  exports: [ // We export these modules to expose them in app-module
    AuthModule,
    FacadesModule,
  ]
})
export class HRMSCoreModule { }
