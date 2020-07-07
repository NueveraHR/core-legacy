import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './common/authentication/auth.controller';
import { CommonApi } from './common/common-api.module';


@Module({
  imports: [
    HRMSCoreModule,
    CommonApi
  ],
  controllers: [AppController, AuthController],
})
export class AppModule { }
