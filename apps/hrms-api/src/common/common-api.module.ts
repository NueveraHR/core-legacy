import { AuthController } from '../auth/auth.controller';
import { Module } from '@nestjs/common';
import { AuthModule } from '@hrms-core/auth/auth.module';
import { AuthFacade } from '@hrms-core/auth/auth.facade';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    imports: [AuthModule],
    controllers: [AuthController],
    providers: [JwtStrategy],
})
export class CommonApi {}
