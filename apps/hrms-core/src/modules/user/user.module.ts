import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { UserDtoPipe } from './pipes/user-dto.pipe';
import { UserDtoValidator } from './validators/user-dto.validator';
import { UserFacade } from './facades/user.facade';
import { UserDtoReversePipe } from './pipes/user-dto-reverse.pipe';

@Module({
    imports: [
        CoreModule,
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
        UserDtoPipe,
        UserDtoValidator,
        UserDtoReversePipe,
        UserFacade,
        
    ]
})
export class UserModule { }
