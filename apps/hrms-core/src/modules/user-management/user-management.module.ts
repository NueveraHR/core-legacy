import { Module } from '@nestjs/common';
import { UserFacade } from './facades/user.facade';
import { CoreModule } from '@hrms-core/core/core.module';
import { UserDtoPipe } from './pipes/user-dto.pipe';
import { UserDtoValidator } from './validators/user-dto.validator';

@Module({
    imports: [
        CoreModule,
    ],
    providers: [
        //validators
        UserDtoValidator,

        // Pipes
        UserDtoPipe,

        // Facades
        UserFacade,
    ],
    exports: [
        UserFacade,
    ]
})
export class UserManagementModule { }
