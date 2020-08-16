import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { UserDtoPipe } from './pipes/user-dto.pipe';
import { UserDtoValidator } from './validators/user-dto.validator';
import { UserFacade } from './facades/user.facade';
import { UserDtoReversePipe } from './pipes/user-dto-reverse.pipe';
import { ConfigModule } from '../config/config.module';
import { RoleDtoPipe } from '../config/pipes/role-dto.pipe';

@Module({
    imports: [
        CoreModule,
        ConfigModule
    ],
    providers: [
        //validators
        UserDtoValidator,

        // Pipes
        UserDtoPipe,
        UserDtoReversePipe,
        
        // Facades
        UserFacade,
    ],
    exports: [
        ConfigModule,

        
        UserDtoPipe,
        UserDtoValidator,
        UserDtoReversePipe,
        UserFacade,

        
    ]
})
export class UserModule { }
