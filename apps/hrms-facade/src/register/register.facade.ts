import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { RedisService } from '@hrms-core/common/services/database/redis.service';
import { UserDto } from '@hrms-core/user/user.dto';
import { UserService } from '@hrms-core/user/user.service';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';
import { MailerService } from '@libs/mailer/mailer.service';

const EXPIRE_REGISTER_TOKEN = 24 * 60 * 60;

@Injectable()
export class RegisterFacade {
    constructor(
        private userService: UserService,
        private redisService: RedisService,
        private mailer: MailerService,
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

    private registerActivateAccountToken(userId: string): string {
        const key = crypto.AES.encrypt(userId, 'akrZ8nj"#r>G7@s4B').toString();
        this.redisService.set(key, '');
        this.redisService.expire(key, EXPIRE_REGISTER_TOKEN);

        return key;
    }

    private sendActivateAccountMail(userDto: UserDto, tokenKey: string) {
        console.log('sending register link with key ', tokenKey);

        const mail = {
            from: 'Nuevera',
            to: 'w.bougarfa@outlook.com',
            subject: 'Welcome to Nuevera',
            template: 'register',
            context: {
                fullName: `${userDto.prefix} ${userDto.firstName} ${userDto.lastName}`,
            },
        };

        this.mailer.send(mail);
    }
}
