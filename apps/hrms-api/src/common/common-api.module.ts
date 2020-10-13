import { Module } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
    providers: [JwtStrategy],
})
export class CommonApi {}
