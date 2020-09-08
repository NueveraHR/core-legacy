import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModuleRef } from '@nestjs/core';
import { RoleService } from '@hrms-core/core/role/role.service';
import { User } from '@hrms-core/core/user/user.schema';
import { UserService } from '@hrms-core/core/user/user.service';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Role } from '@hrms-core/core/role/role.schema';
import { Errors } from '@hrms-core/common/error/error.const';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthFacade {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(private jwtService: JwtService, private readonly moduleRef: ModuleRef) {}

    private _userService;
    private get userService(): UserService {
        if (!this._userService) {
            this._userService = this.moduleRef.get(UserService, {
                strict: false,
            });
        }
        return this._userService;
    }

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
            .catch(err => Promise.reject(this.errorService.generate(Errors.Login.INVALID_CREDENTIALS)));

        let token;
        if (foundUser) {
            await bcrypt.compare(user.password, foundUser.password).then(same => {
                if (same) {
                    token = this.generateTokenForUser(foundUser);
                }
            });

            if (token) {
                return {
                    token: token,
                    userId: foundUser.id,
                    userType: foundUser.type,
                };
            }
        }

        return Promise.reject(this.errorService.generate(Errors.Login.INVALID_CREDENTIALS));
    }

    private generateTokenForUser(user: any): string {
        const payload = { id: user.id, role: user.role }; //TODO: encode privileges
        return this.jwtService.sign(payload);
    }
}
