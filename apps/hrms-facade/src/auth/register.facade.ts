import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { RedisService } from '@hrms-core/common/services/database/redis.service';
import { UserDto } from '@hrms-core/user/user.dto';
import { UserService } from '@hrms-core/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { MailerService } from '@libs/mailer/mailer.service';
import { EnvData, EnvService } from '@libs/env';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';

const EXPIRE_REGISTER_TOKEN = 24 * 60 * 60; // 24 hrs
@Injectable()
export class RegisterFacade {
    @Inject(ErrorService) errorService: ErrorService;
    env: EnvData;

    constructor(
        private userService: UserService,
        private redisService: RedisService,
        private mailer: MailerService,
        private envService: EnvService,
    ) {
        this.env = this.envService.read();
    }

    async register(userDto: UserDto): Promise<UserDto> {
        if (userDto.type && userDto.type !== UserType.EMPLOYEE) {
            userDto.accountActivated = true;
        }

        const registeredUser = await this.userService.create(userDto);
        if (!registeredUser.accountActivated) {
            const key = this.registerActivateAccountToken(registeredUser.id);
            this.sendActivateAccountMail(userDto, key);
        }

        return registeredUser;
    }

    async activateAccount(token: string, password: string): Promise<boolean> {
        //TODO: validate
        if (await this.validateToken(token)) {
            const userId = crypto.AES.decrypt(token, this.env.COMMON_ENC_KEY).toString(
                crypto.enc.Utf8,
            );
            const user = await this.userService.findById(userId);
            if (user && !user.accountActivated) {
                user.password = password;
                user.accountActivated = true;
                await this.userService.update(user);
                this.redisService.delete(token);
                return true;
            }
        }

        return Promise.reject(
            this.errorService.generate(Errors.User.ACTIVATE_INVALID_TOKEN),
        );
    }

    async validateToken(token: string): Promise<boolean> {
        const tokenValue = await this.redisService.get(token);
        return tokenValue === 'activate';
    }

    private registerActivateAccountToken(userId: string): string {
        const key = crypto.AES.encrypt(userId, this.env.COMMON_ENC_KEY).toString();
        this.redisService.set(key, 'activate');
        this.redisService.expire(key, EXPIRE_REGISTER_TOKEN);

        return key;
    }

    private sendActivateAccountMail(userDto: UserDto, token: string) {
        const encodedToken = encodeURIComponent(token); // for uri support
        const mail = {
            from: `${this.env.COMPANY_NAME} <${this.env.SMTP_USER}>`,
            to: userDto.email,
            subject: `Welcome to ${this.env.COMPANY_NAME}`,
            template: 'register',
            context: {
                companyName: this.env.COMPANY_NAME,
                fullName: `${userDto.prefix} ${userDto.firstName} ${userDto.lastName}`,
                expirationPeriod: '24 hours',
                registrationLink: `${this.env.REGISTER_USER_URL}?invite=${encodedToken}`,
            },
        };

        this.mailer.send(mail);
    }
}
