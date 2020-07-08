import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { RoleMangementFacade } from './facades/role-management.facade';

@Module({
    imports: [
        CoreModule
    ],
    providers: [
        RoleMangementFacade,
    ],
    exports: [
        RoleMangementFacade
    ]
})
export class ConfigManagementModule { }
