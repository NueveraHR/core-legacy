import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './common/auth/auth.controller';
import { CommonApi } from './common/common-api.module';
import { UserManagementApi } from './user-management/user-management-api.module';


@Module({
  imports: [
    HRMSCoreModule,
    CommonApi,

    UserManagementApi
  ],
  controllers: [AppController, AuthController],
})
export class AppModule { }
