import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { RoleConfigurationFacade } from './facades/role-configuration.facade';

@Module({
    imports: [
        CoreModule
    ],
    providers: [
        RoleConfigurationFacade,
    ],
    exports: [
        RoleConfigurationFacade
    ]
})
export class ConfigManagementModule { }
