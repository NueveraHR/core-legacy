import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { CommonApi } from './common/common-api.module';
import { EmployeeApiModule } from './employee/employee-api.module';
import { ConfigApiModule } from './config/config-api.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@hrms-core/core/document-mangment/multerConfig.service';
import { UploadController } from './upload/upload.controller';


@Module({
  imports: [
    HRMSCoreModule,

    CommonApi,
    EmployeeApiModule,
    ConfigApiModule,
    MulterModule.registerAsync({
      useClass: MulterConfigService
    })
  ],
  controllers: [AppController, AuthController, UploadController],
})
export class AppModule { }
