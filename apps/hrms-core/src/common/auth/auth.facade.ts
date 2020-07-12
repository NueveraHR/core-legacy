import * as bcrypt from 'bcrypt';
import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ModuleRef } from '@nestjs/core';
import { RoleService } from '@hrms-core/core/role/role.service';
import { User } from '@hrms-core/core/user/user.schema';
import { UserService } from '@hrms-core/core/user/user.service';
import { UserDto } from '@hrms-core/dto/user.dto';
import { DtoService } from '@hrms-core/common/services/dto/error-dto.service';
import { Role } from '@hrms-core/core/role/role.schema';

@Injectable()
export class AuthFacade {

    @Inject(DtoService) dtoService: DtoService;

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


    async auth(user: UserDto): Promise<object> {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (user?.email?.trim() === '') {
            return Promise.reject(this.dtoService.error(41100));
        }

        if (reg.test(user.email) === false) {
            return Promise.reject(this.dtoService.error(41101));
        }

        if (user?.password === '') {
            return Promise.reject(this.dtoService.error(41102));
        }

        let foundUser: User;
        await this.userService.findByEmail(user.email)
            .then((usr) => foundUser = usr)
            .catch(err => Promise.reject(this.dtoService.error(41200)));

        let token;
        if (foundUser) {
            await bcrypt.compare(user.password, foundUser.password).then(same => {
                if (same) {
                    token = this.generateTokenForUser(foundUser);
                }
            });


            if (token) {
                return { token: token, userId: foundUser.id, roleId: (foundUser.role as Role).id };
            }
        }


        return Promise.reject(this.dtoService.error(41200));
    }

    private generateTokenForUser(user: any): string {
        const payload = { id: user.id, role: user.role }; //TODO: encode privileges
        return this._jwtService.sign(payload);
    }

}