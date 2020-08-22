import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { UserDtoPipe } from './pipes/user-dto.pipe';
import { UserDtoValidator } from './validators/user-dto.validator';
import { UserFacade } from './facades/user.facade';
import { UserDtoReversePipe } from './pipes/user-dto-reverse.pipe';
import { ConfigModule } from '../config/config.module';

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

    ],
    exports: [
        ConfigModule,

        
        UserDtoPipe,
        UserDtoValidator,
        UserDtoReversePipe,        
    ]
})
export class UserModule { }
