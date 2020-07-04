import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';


@Module({
  imports: [
    HRMSCoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
