import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';

@Module({
    imports: [
        CoreModule
    ]
})
export class ConfigManagementModule {}
