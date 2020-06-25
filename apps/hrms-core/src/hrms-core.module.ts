import { Module, Inject } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { ProfileManagementModule } from './modules/profile-management/profile-management.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@libs/env';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { DBConnectionManager } from './shared/services/database/connection-manager.service';


const connectionManager = new DBConnectionManager();


@Module({
  imports: [
    EnvModule,
    MongooseModule.forRoot(connectionManager.getConnectionString(), connectionManager.getConnectionOptions()),
    ConfigModule.forRoot({ isGlobal: true }),
    CoreModule,
    SharedModule,
    ConfigurationModule,
    UserManagementModule,
    ProfileManagementModule,
  ],
})
export class HRMSCoreModule { }
