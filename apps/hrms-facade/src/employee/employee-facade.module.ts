import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AuthFacadeModule } from '@hrms-facades/auth/auth.module';
import { Module } from '@nestjs/common';
import { EmployeeFacade } from './employee.facade';
import { EmployeeAdvancedFilterStrategy } from './filters/advanced-filter.strategy';
import { EmployeeDefaultFilterStrategy } from './filters/default-filter.strategy';
import { EmployeesFilterManagerService } from './filters/filter-manager.service';

@Module({
    imports: [HRMSCoreModule, AuthFacadeModule],
    providers: [
        EmployeeDefaultFilterStrategy,
        EmployeeAdvancedFilterStrategy,
        EmployeesFilterManagerService,

        EmployeeFacade,
    ],
    exports: [EmployeeFacade],
})
export class EmployeeFacadeModule {}
