import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';
import { JobModule } from './job/job.module';

import { DocumentModule } from './document/document.module';
import { AddressModule } from './address/address.module';
import { EducationModule } from './user/education/education.module';
import { LanguageModule } from './user/language/languauge.module';
import { CertificationModule } from './user/certification/certification.module';

@Module({
    imports: [
        HRMSConfigModule,
        DocumentModule,
        RoleModule,
        UserModule,
        AddressModule,
        EducationModule,
        LanguageModule,
        CertificationModule,
        EmployeeModule,
        JobModule,
    ],
    exports: [
        DocumentModule,
        RoleModule,
        UserModule,
        AddressModule,
        EducationModule,
        LanguageModule,
        CertificationModule,
        EmployeeModule,
        JobModule,
    ],
})
export class CoreModule {}
