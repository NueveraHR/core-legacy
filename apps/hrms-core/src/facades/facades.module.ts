import { Module } from '@nestjs/common';
import { RoleFacade } from './role.facade';
import { EmployeeFacade } from './employee.facade';
import { CoreModule } from '@hrms-core/core/core.module';

@Module({
    imports: [CoreModule],
    providers: [RoleFacade, EmployeeFacade],
    exports: [RoleFacade, EmployeeFacade],
})
export class FacadesModule {}
