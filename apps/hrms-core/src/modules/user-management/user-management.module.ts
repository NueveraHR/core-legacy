import { Module } from '@nestjs/common';
import { UserFacade } from './facades/user.facade';
import { CoreModule } from '@hrms-core/core/core.module';

@Module({
    imports: [
        CoreModule,
    ],
    providers: [
        UserFacade,
    ],
    exports: [
        UserFacade,
    ]
})
export class UserManagementModule { }
