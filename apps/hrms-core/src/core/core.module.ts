import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';
import { JobModule } from './job/job.module';

import { DocumentModule } from './document/document.module';

@Module({
    imports: [HRMSConfigModule, DocumentModule, RoleModule, UserModule, EmployeeModule, JobModule],
    exports: [DocumentModule, RoleModule, UserModule, EmployeeModule, JobModule],
})
export class CoreModule {}
