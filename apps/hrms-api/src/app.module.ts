import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { CommonApi } from './common/common-api.module';
import { UserManagementApi } from './user-management/user-management-api.module';
import { ConfigManagementApi } from './config-management/config-management-api.module';


@Module({
  imports: [
    HRMSCoreModule,

    CommonApi,
    UserManagementApi,
    ConfigManagementApi
  ],
  controllers: [AppController, AuthController],
})
export class AppModule { }
