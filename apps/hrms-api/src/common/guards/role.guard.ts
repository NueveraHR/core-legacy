import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleDto } from '@hrms-core/dto/role.dto';

@Injectable()
export class PrivilegesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const privileges = this.reflector.get<string[]>('privileges', context.getHandler());
        if (!privileges) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return this.isPermitted(user, privileges);
    }

    private isPermitted(user: { id: string, role: RoleDto }, demandedPrivileges: string[]): boolean {
        const userPrivileges = user?.role?.privileges;

        // Allow operation if no privileges are required
        if (!demandedPrivileges || demandedPrivileges.length == 0) {
            return true;
        }

        // otherwise, reject if user has no privileges 
        if (!userPrivileges) {
            return false;
        }


        return userPrivileges.findIndex((pr) => pr == demandedPrivileges[0]) != -1;

    }
}