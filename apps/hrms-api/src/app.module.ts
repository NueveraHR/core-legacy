import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBModule } from 'apps/hrms-db/src/db.module';
import { CoreModule } from 'apps/hrms-core/src/core.module';

@Module({
  imports: [
    CoreModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 