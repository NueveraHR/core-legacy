import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { CoreModule } from '@hrms-core/core/core.module';

@Module({
    imports: [
        CoreModule
    ]
})
export class ConfigurationModule {}
