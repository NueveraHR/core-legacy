import { Module } from '@nestjs/common';
import { CoreModule } from '@hrms-core/core/core.module';
import { RoleFacade } from './facades/role.facade';
import { RoleDtoValidator } from './validators/role-dto.validator';
import { RoleDtoReversePipe } from './pipes/role-dto-reverse.pipe';
import { RoleDtoPipe } from './pipes/role-dto.pipe';
import { PrivilegesDtoPipe } from './pipes/privilege-dto.pipe';

@Module({
    imports: [
        CoreModule
    ],
    providers: [
        // Pipes
        PrivilegesDtoPipe,
        RoleDtoPipe,
        RoleDtoReversePipe,

        //validators
        RoleDtoValidator,

        // Facades
        RoleFacade,
    ],
    exports: [
        RoleFacade
    ]
})
export class ConfigModule { }
