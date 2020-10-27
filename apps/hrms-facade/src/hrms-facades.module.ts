import { Module } from '@nestjs/common';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { RoleFacade } from './role/role.facade';
import { EmployeeFacadeModule } from './employee/employee-facade.module';
import { AuthFacadeModule } from './auth/auth.module';

@Module({
    imports: [
        HRMSCoreModule, //TODO: Remove after importing in roleFacade

        AuthFacadeModule,
        EmployeeFacadeModule,
    ],
    providers: [RoleFacade],
    exports: [RoleFacade, AuthFacadeModule, EmployeeFacadeModule],
})
export class HrmsFacadesModule {}
