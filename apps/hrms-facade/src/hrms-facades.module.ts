import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { RoleFacade } from './role/role.facade';
import { EmployeeFacade } from './employee/employee.facade';
import { AuthFacade } from './auth/auth.facade';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EnvService } from '@libs/env';

const envService = new EnvService();

@Module({
    imports: [
        HRMSCoreModule,
        PassportModule,
        JwtModule.register({
            secret: envService.read().JWT_SECRETKEY,
            signOptions: { expiresIn: envService.read().JWT_EXPIRESIN },
        }),
    ],
    providers: [AuthFacade, RoleFacade, EmployeeFacade],
    exports: [AuthFacade, RoleFacade, EmployeeFacade],
})
export class HrmsFacadesModule {}
