import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { RedisService } from '@hrms-core/common/services/database/redis.service';
import { UserDto } from '@hrms-core/user/user.dto';
import { UserService } from '@hrms-core/user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { MailerService } from '@libs/mailer/mailer.service';
import { EnvService } from '@libs/env';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';

const EXPIRE_REGISTER_TOKEN = 24 * 60 * 60;
const ENC_KEY = 'akrZ8nj"#r>G7@s4B';
@Injectable()
export class RegisterFacade {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        private userService: UserService,
        private redisService: RedisService,
        private mailer: MailerService,
        private envService: EnvService,
    ) {}

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
            const userId = crypto.AES.decrypt(token, ENC_KEY).toString(crypto.enc.Utf8);
            const user = await this.userService.findById(userId);
            if (user) {
                user.password = password;
                user.accountActivated = true;
                await this.userService.update(user);
                return true;
            }
        }

        return Promise.reject(
            this.errorService.generate(Errors.User.ACTIVATE_INVALID_TOKEN),
        );
    }

    async validateToken(token: string): Promise<boolean> {
        const tokenValue = await this.redisService.get(token);
        return tokenValue !== null;
    }

    private registerActivateAccountToken(userId: string): string {
        const key = crypto.AES.encrypt(userId, ENC_KEY).toString();
        this.redisService.set(key, '');
        this.redisService.expire(key, EXPIRE_REGISTER_TOKEN);

        return key;
    }

    private sendActivateAccountMail(userDto: UserDto, token: string) {
        const env = this.envService.read();
        console.log(userDto);
        const mail = {
            from: `${env.COMPANY_NAME} <${env.SMTP_USER}>`,
            to: userDto.email,
            subject: `Welcome to ${env.COMPANY_NAME}`,
            template: 'register',
            context: {
                companyName: env.COMPANY_NAME,
                fullName: `${userDto.prefix} ${userDto.firstName} ${userDto.lastName}`,
                expirationPeriod: '24 hours',
                registrationLink: `${env.REGISTER_USER_URL}?invite=${token}`,
            },
        };

        this.mailer.send(mail);
    }
}
