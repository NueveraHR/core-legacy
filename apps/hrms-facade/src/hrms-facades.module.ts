import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { RoleFacade } from './role/role.facade';
import { EmployeeFacade } from './employee/employee.facade';
import { AuthFacade } from './auth/auth.facade';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from '@libs/env';
import { RegisterFacade } from './auth/register.facade';
import { MailerService } from '@libs/mailer/mailer.service';
import { RestoreAccountFacade } from './auth/restore-account.facade';

const envService = new EnvService();

@Module({
    imports: [
        HRMSCoreModule,
        PassportModule,
        JwtModule.register({
            secret: envService.read().JWT_SECRETKEY,
            signOptions: { expiresIn: envService.read().JWT_EXPIRESIN },
        }),
    ],
    providers: [
        AuthFacade,
        RegisterFacade,
        RestoreAccountFacade,
        RoleFacade,
        EmployeeFacade,
        MailerService,
    ],
    exports: [
        AuthFacade,
        RegisterFacade,
        RestoreAccountFacade,
        RoleFacade,
        EmployeeFacade,
    ],
})
export class HrmsFacadesModule {}
