import { Module, Global } from '@nestjs/common';
import { HRMSConfigService } from './config.service';
import { EnvModule } from '@libs/env';

@Global()
@Module({
  imports: [
    EnvModule,
  ],
  providers: [HRMSConfigService],
  exports: [HRMSConfigService],
})
export class HRMSConfigModule {
}
