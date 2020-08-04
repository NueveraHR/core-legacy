import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { CommonApi } from './common/common-api.module';
import { EmployeeApiModule } from './employee/employee-api.module';
import { ConfigApiModule } from './config/config-api.module';


@Module({
  imports: [
    HRMSCoreModule,

    CommonApi,
    EmployeeApiModule,
    ConfigApiModule
  ],
  controllers: [AppController, AuthController],
})
export class AppModule { }
