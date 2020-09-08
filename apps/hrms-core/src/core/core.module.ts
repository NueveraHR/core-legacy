import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';
import { JobModule } from './job/job.module';

import { DocumentModule } from './document/document.module';
import { AddressModule } from './address/address.module';

@Module({
    imports: [HRMSConfigModule, DocumentModule, RoleModule, UserModule, AddressModule, EmployeeModule, JobModule],
    exports: [DocumentModule, RoleModule, UserModule, AddressModule, EmployeeModule, JobModule],
})
export class CoreModule {}
