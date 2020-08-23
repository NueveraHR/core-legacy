import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { CommonApi } from './common/common-api.module';

import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@hrms-core/core/document/multerConfig.service';
import { UploadController } from './upload/upload.controller';
import { EmployeeRecordController } from './controllers/record.controller';
import { RoleController } from './controllers/role.controller';
import { EmployeeProfileController } from './controllers/profile.controller';

@Module({
    imports: [HRMSCoreModule, CommonApi, MulterModule.registerAsync({ useClass: MulterConfigService })],
    controllers: [AppController, AuthController, UploadController, RoleController, EmployeeRecordController],
})
export class AppModule {}
