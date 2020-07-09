import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModuleRef } from '@nestjs/core';
import { RoleService } from '@hrms-core/core/role/role.service';
import { User } from '@hrms-core/core/user/user.schema';
import { UserService } from '@hrms-core/core/user/user.service';
import { UserDto } from '@hrms-core/dto/user.dto';
import { ErrorDto } from '@hrms-core/dto/error.dto';

@Injectable()
export class AuthFacade {

    constructor(
        private _jwtService: JwtService,
        private readonly _moduleRef: ModuleRef
    ) {

    }

    private _roleService;
    private get roleService(): RoleService {
        if (!this._roleService) {
            this._roleService = this._moduleRef.get(RoleService);
        }
        return this._roleService;
    }

    private _userService;
    private get userService(): UserService {
        if (!this._userService) {
            this._userService = this._moduleRef.get(UserService, { strict: false });
        }
        return this._userService;
    }


    async auth(user: UserDto): Promise<string> {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (user?.email?.trim() === '') {
            return Promise.reject(new ErrorDto('No email address provided'));
        }

        if (reg.test(user.email) === false) {
            return Promise.reject(new ErrorDto('Invalid email provided'));
        }

        if (user?.password === '') {
            return Promise.reject(new ErrorDto('No password provided'));
        }

        let savedUser: User;
        await this.userService.findByEmail(user.email).then((foundUser) => savedUser = foundUser);
        if (savedUser) {
            if (bcrypt.compare(user.password, user.password)) {
                return this.generateTokenForUser(savedUser);
            }
        }
        return Promise.reject(new ErrorDto('Invalid login credentials'));
    }

    private generateTokenForUser(user: any): string {
        const payload = { email: user.email, role: user.role }; //TODO: encode privileges
        return this._jwtService.sign(payload);
    }

}