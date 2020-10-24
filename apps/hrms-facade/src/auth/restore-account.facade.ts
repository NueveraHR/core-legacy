import { Errors } from '@hrms-core/common/error/error.const';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { RedisService } from '@hrms-core/common/services/database/redis.service';
import { ValidatorUtils } from '@hrms-core/common/utils/validator.utils';
import { UserDto } from '@hrms-core/user/user.dto';
import { UserService } from '@hrms-core/user/user.service';
import { EnvService } from '@libs/env';
import { MailerService } from '@libs/mailer';
import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const EXPIRE_RESET_TOKEN = 1 * 60 * 60; // 1 hour
const SALT_ROUNDS = 10;

@Injectable()
export class RestoreAccountFacade {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        private userService: UserService,
        private redisService: RedisService,
        private mailer: MailerService,
        private envService: EnvService,
    ) {}

    async reserveRequest(email: string): Promise<boolean> {
        //TODO: validate input
        const user = await this.userService.findByEmail(email);
        if (user && user.accountActivated) {
            const token = await this.registerResetPasswordToken(user);
            this.sendResetPasswordEmail(user, token);
        }

        return true;
    }

    async validateToken(token: string): Promise<boolean> {
        const id = await this.redisService.get(token);
        return ValidatorUtils.isValidId(id);
    }

    async restore(token: string, newPassword: string): Promise<boolean> {
        //TODO: validate input
        const tokenValue = await this.redisService.get(token);
        if (tokenValue) {
            const user = await this.userService.findById(tokenValue);
            user.password = newPassword;
            this.userService.update(user);
            this.redisService.delete(token);
            return true;
        }

        return Promise.reject(
            this.errorService.generate(Errors.User.RESTORE_ACCOUNT_INVALID_TOKEN),
        );
    }

    private sendResetPasswordEmail(userDto: UserDto, token: string): Promise<any> {
        const env = this.envService.read();
        const encodedToken = encodeURIComponent(token); // for uri support
        const mail = {
            from: `${env.COMPANY_NAME} <${env.SMTP_USER}>`,
            to: userDto.email,
            subject: `Password Reset`,
            template: 'reset-password',
            context: {
                companyName: env.COMPANY_NAME,
                fullName: `${userDto.prefix} ${userDto.firstName} ${userDto.lastName}`,
                expirationPeriod: '1 hour',
                resetPasswordLink: `${env.RESET_PASSWORD_URL}?reset=${encodedToken}`,
            },
        };
        return this.mailer.send(mail);
    }

    private async registerResetPasswordToken(user: UserDto): Promise<string> {
        const rand = Math.random()
            .toString(36)
            .substring(7);
        const token = await bcrypt.hash(rand, SALT_ROUNDS);
        this.redisService.set(token, user.id);
        this.redisService.expire(token, EXPIRE_RESET_TOKEN);
        return token;
    }
}
