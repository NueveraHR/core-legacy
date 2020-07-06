import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModuleRef } from '@nestjs/core';
import { RoleService } from '@hrms-core/core/role/role.service';
import { User } from '@hrms-core/core/user/user.schema';
import { UserService } from '@hrms-core/core/user/user.service';
import { userDTO } from '@hrms-core/dto/user.dto';

@Injectable()
export class AuthFacade {

    constructor(
        private _jwtService: JwtService,
        private readonly _moduleRef: ModuleRef
    ) {

    }

    private _roleService;
    get roleService(): RoleService {
        if (!this._roleService) {
            this._roleService = this._moduleRef.get(RoleService);
        }
        return this._roleService;
    }

    private _userService;
    get userService(): UserService {
        if (!this._userService) {
            this._userService = this._moduleRef.get(RoleService);
        }
        return this._userService;
    }

    async validateUser(user: any) {
        if (user.email.trim() === '') {
            throw Error("You should enter your email.");
        } else {
            let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(user.email) === false) {
                throw Error("You email is not valid.");
            } else if (user.password === '') {
                throw Error("You should enter your password");
            } else {
                let savedUser: User;
                await this.userService.findByEmail(user.email).then((foundUser) => savedUser = foundUser);
                if (user) {
                    let savedPassword = bcrypt.hash(user.password, 10);
                    if (bcrypt.compare(savedPassword, user.password)) {
                        let userToken;
                        await this.genirateTokenForUser(savedUser).then((token) => userToken = token);
                        return userToken;
                    } else {
                        throw Error("Your email or password Incorrect");
                    }
                } else {
                    throw Error("Your email or password Incorrect");
                }
            }
        }
    }

    async genirateTokenForUser(user: any) {
        const payload = { email: user.email, role: user.role };
        return {
            access_token: this._jwtService.sign(payload)
        };
    }

}