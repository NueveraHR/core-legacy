import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto-js';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@hrms-core/user/user.schema';
import { UserService } from '@hrms-core/user/user.service';
import { UserDto } from '@hrms-core/user/user.dto';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { AuthDto } from '@hrms-core/auth/auth.dto';
import { RedisService } from '@hrms-core/common/services/database/redis.service';

@Injectable()
export class AuthFacade {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(private userService: UserService, private jwtService: JwtService) {}

    async auth(user: UserDto): Promise<AuthDto> {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (user?.email?.trim() === '') {
            return Promise.reject(this.errorService.generate(Errors.Login.NO_EMAIL));
        }

        if (reg.test(user.email) === false) {
            return Promise.reject(this.errorService.generate(Errors.Login.INVALID_EMAIL));
        }

        if (user?.password === '') {
            return Promise.reject(this.errorService.generate(Errors.Login.NO_PASSWORD));
        }

        let foundUser: User;
        await this.userService
            .findByEmail(user.email)
            .then(usr => (foundUser = usr))
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.Login.INVALID_CREDENTIALS),
                ),
            );

        let token;
        if (foundUser) {
            if (!foundUser.accountActivated) {
                return Promise.reject(
                    this.errorService.generate(Errors.Login.ACCOUNT_LOCKED),
                );
            }
            await bcrypt.compare(user.password, foundUser.password).then(same => {
                if (same) {
                    token = this.generateTokenForUser(foundUser);
                }
            });

            if (token) {
                return {
                    token: token,
                    userType: foundUser.type,
                    id: foundUser.id,
                    username: foundUser.username,
                    firstName: foundUser.firstName,
                    middleName: foundUser.middleName,
                    lastName: foundUser.lastName,
                    email: foundUser.email,
                    picture: foundUser.picture,
                    role: foundUser.role,
                    gender: foundUser.gender,
                };
            }
        }

        return Promise.reject(
            this.errorService.generate(Errors.Login.INVALID_CREDENTIALS),
        );
    }

    private generateTokenForUser(user: any): string {
        const signedJWt = this.jwtService.sign({ id: user.id, role: user.role });
        return crypto.AES.encrypt(signedJWt, 'akrZ8nj"#r>G7@s4B').toString();
    }
}
