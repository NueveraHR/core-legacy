import { Module, Inject } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { CommonModule } from './common/common.module';
import { DBConnectionManager } from './common/services/database/connection-manager.service';

import { AuthModule } from './auth/auth.module';
import { FacadesModule } from './facades/facades.module';
import { DocumentModule } from './core/document/document.module';
import { CoreModule } from './core/core.module';

const connectionManager = new DBConnectionManager();


@Module({
  imports: [
    EnvModule,
    LoggerModule,
    MongooseModule.forRoot(connectionManager.getConnectionString(), connectionManager.getConnectionOptions()),
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    CoreModule,

    AuthModule,
    FacadesModule
  ],
  exports: [ // We export these modules to expose them in app-module
    AuthModule,
    CoreModule, // TODO: Remove after exposing document facade
    FacadesModule,
  ]
})
export class HRMSCoreModule { }
