import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { EnvService } from '@libs/env';
import { AuthFacade } from './auth.facade';
import { RegisterFacade } from './register.facade';
import { RestoreAccountFacade } from './restore-account.facade';
import { MailerService } from '@libs/mailer';
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
    providers: [MailerService, AuthFacade, RegisterFacade, RestoreAccountFacade],
    exports: [AuthFacade, RegisterFacade, RestoreAccountFacade],
})
export class AuthFacadeModule {}
