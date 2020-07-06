import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthFacade } from './auth.facade';


@Module({
    imports: [
        HRMSConfigModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRETKEY, signOptions: {
                expiresIn: process.env.JWT_EXPIRESIN,
            },
        })
    ],
    providers: [],
    exports: [AuthFacade]
})
export class AuthModule { }
