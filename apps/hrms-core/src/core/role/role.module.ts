import { Module } from '@nestjs/common';
import { RoleDtoValidator } from './validators/role-dto.validator';
import { RoleDtoReversePipe } from './pipes/role-dto-reverse.pipe';
import { RoleDtoPipe } from './pipes/role-dto.pipe';
import { PrivilegesDtoPipe } from './pipes/privilege-dto.pipe';
import { PrivilegeModule } from '../privilege/privilege.module';
import { RoleService } from './role.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';

@Module({
    imports: [
        PrivilegeModule,
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])
    ],
    providers: [
        // Pipes
        PrivilegesDtoPipe,
        RoleDtoPipe,
        RoleDtoReversePipe,

        //validators
        RoleDtoValidator,

        // service
        RoleService
    ],
    exports: [
        PrivilegeModule,

        PrivilegesDtoPipe,
        RoleDtoPipe,
        RoleDtoReversePipe,
        RoleDtoValidator,

        RoleService,
    ]
})
export class RoleModule { }
