import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { UserDtoPipe } from './pipes/user-dto.pipe';
import { UserDtoValidator } from './validators/user-dto.validator';
import { UserFacade } from './facades/user.facade';

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
export class EmployeeManagementModule { }
