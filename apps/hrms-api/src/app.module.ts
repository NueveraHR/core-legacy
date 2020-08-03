import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { CommonApi } from './common/common-api.module';
import { EmployeeApi } from './employee/employee-api.module';
import { ConfigApi } from './config/config-api.module';


@Module({
  imports: [
    HRMSCoreModule,

    CommonApi,
    EmployeeApi,
    ConfigApi
  ],
  controllers: [AppController, AuthController],
})
export class AppModule { }
