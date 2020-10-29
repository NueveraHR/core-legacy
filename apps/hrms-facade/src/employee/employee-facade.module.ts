import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AuthFacadeModule } from '@hrms-facades/auth/auth.module';
import { Module } from '@nestjs/common';
import { EmployeeFacade } from './employee.facade';
import { AdvancedEmployeeFilterStrategy } from './filters/advanced-filter.strategy';
import { DefaultEmployeeFilterStrategy } from './filters/default-filter.strategy';
import { EmployeesFilterManagerService } from './filters/filter-manager.service';

@Module({
    imports: [HRMSCoreModule, AuthFacadeModule],
    providers: [
        DefaultEmployeeFilterStrategy,
        AdvancedEmployeeFilterStrategy,
        EmployeesFilterManagerService,

        EmployeeFacade,
    ],
    exports: [EmployeeFacade],
})
export class EmployeeFacadeModule {}
