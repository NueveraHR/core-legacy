import { UserDto } from '@hrms-core/user/user.dto';
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UserService } from '@hrms-core/user/user.service';
import { EnvService } from '@libs/env';
import { LoggerService } from '@libs/logger';
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtDocumentMiddleware implements NestMiddleware {
    constructor(
        private logger: LoggerService,
        private envService: EnvService,
        private userService: UserService,
    ) {}

    async use(req: any, res: any, next: () => void): Promise<void> {
        const token = req.cookies.Authentication;
        if (!token) {
            throw new HttpException('Forbidden.', HttpStatus.UNAUTHORIZED);
        }
        const decoded: any = jwt.verify(token, this.envService.read().JWT_SECRETKEY);
        const user = await this.userService.findById(decoded.id);

        if (!user) {
            throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }
        req.user = user as UserDto;

        next();
    }
}
