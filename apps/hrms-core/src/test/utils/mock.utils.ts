import { EnvService } from "@libs/env";
import { UserService } from "@hrms-core/core/user/user.service";
import { RoleService } from "@hrms-core/core/role/role.service";
import { USERS } from "../mock/user-mock";
import { ROLES } from "../mock/role-mock";
import { User } from "@hrms-core/core/user/user.schema";
import { Role } from "@hrms-core/core/role/role.schema";

export class MockUtils {
    constructor(
        private envService: EnvService,
        private roleService: RoleService,
        private userService: UserService
    ) {
        if (!envService.isTest()) {
            throw new Error('Cannot use mock utils for non test environments');
        }
    }

    createRole(roleKey: string): Promise<Role> {
        if (!roleKey) {
            throw new Error(`no role data found matching key: ${roleKey}`);
        } else {
            const roleDto = ROLES[roleKey];
            return this.roleService.create(roleDto);
        }
    }

    async createUser(userKey: string, roleKey: string = null): Promise<User> {
        const userDto = USERS[userKey];

        if (!userDto) {
            throw new Error(`no user data found matching key: ${userKey}`);
        }

        if (roleKey) {
            const roleDto = ROLES[roleKey];
            if (!roleDto) {
                throw new Error(`no role data found matching key: ${roleKey}`);
            } else {
                await this.roleService.create(roleDto).then(role => {
                    userDto['role'] = role.id;
                })
            }
        }

        return this.userService.create(userDto);
    }
}