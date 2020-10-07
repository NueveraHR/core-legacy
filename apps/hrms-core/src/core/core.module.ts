import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';
import { JobModule } from './job/job.module';

import { DocumentModule } from './document/document.module';
import { JobFieldModule } from './job-field/job-field.module';

@Module({
    imports: [HRMSConfigModule, DocumentModule, RoleModule, UserModule, EmployeeModule, JobModule, JobFieldModule],
    exports: [DocumentModule, RoleModule, UserModule, EmployeeModule, JobModule, JobFieldModule],
})
export class CoreModule {}
