import { LoggerService } from '@libs/logger';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import * as crypto from 'crypto-js';

@Injectable()
export class JwtDecryptMiddleware implements NestMiddleware {
    constructor(private logger: LoggerService) {}

    use(req: Request, res: Request, next: () => void): void {
        const cookies = (req as any).cookies;
        if (cookies?.Authentication) {
            try {
                const dec = crypto.AES.decrypt(cookies.Authentication, 'akrZ8nj"#r>G7@s4B').toString(crypto.enc.Utf8);
                cookies.Authentication = dec;
            } catch (e) {
                this.logger.error(e);
            }
        }
        next();
    }
}
