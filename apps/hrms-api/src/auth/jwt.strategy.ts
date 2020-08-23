import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { EnvService } from '@libs/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private envService: EnvService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envService.read()?.JWT_SECRETKEY,
        });
    }

    validate(payload: any): any {
        return { id: payload.id, role: payload.role };
    }
}
0;
