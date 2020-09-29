import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleDto } from '@hrms-core/dto/role.dto';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FORBIDDEN_ERROR, GqlError } from '../utils/error.utils';

@Injectable()
export class PrivilegesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    canActivate(context: ExecutionContext): boolean | Promise<any> {
        const handlerPrivileges = this.reflector.get<string[]>('privileges', context.getHandler()) || [];
        const controllerPrivileges = this.reflector.get<string[]>('privileges', context.getClass()) || [];
        const ignorePrivileges = this.reflector.get<string[]>('ignorePrivileges', context.getHandler());
        const privileges = [...controllerPrivileges, ...handlerPrivileges];

        if (ignorePrivileges || privileges.length == 0) {
            return true;
        }

        const request = this.getRequest(context);
        const user = request.user;

        return this.isPermitted(user, privileges) || Promise.reject(GqlError(FORBIDDEN_ERROR));
    }

    private isPermitted(user: { id: string; role: RoleDto }, demandedPrivileges: string[]): boolean {
        const userPrivileges = user?.role?.privileges;

        // Allow operation if no privileges are required
        if (!demandedPrivileges || demandedPrivileges.length == 0) {
            return true;
        }

        // otherwise, reject if user has no privileges
        if (!userPrivileges) {
            return false;
        }

        let isFullMatch = true;
        demandedPrivileges.forEach(privilege => {
            isFullMatch = isFullMatch && userPrivileges.findIndex(pr => pr == privilege) != -1;
            if (!isFullMatch) {
                return;
            }
        });

        return isFullMatch;
    }
}
