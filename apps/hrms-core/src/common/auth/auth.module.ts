import { Module, Inject } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthFacade } from './auth.facade';
import { EnvService } from '@libs/env';

const envService = new EnvService();

@Module({
    imports: [
        HRMSConfigModule,
        PassportModule,
        JwtModule.register({
            secret: envService.read().JWT_SECRETKEY,
            signOptions: { expiresIn: envService.read().JWT_EXPIRESIN },
        })
    ],
    providers: [
        AuthFacade,
    ],
    exports: [AuthFacade]
})
export class AuthModule { }
