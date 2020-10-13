import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { JobModule } from './job/job.module';

import { DocumentModule } from './document/document.module';
import { JobFieldModule } from './job-field/job-field.module';

@Module({
    imports: [HRMSConfigModule, DocumentModule, RoleModule, UserModule, JobModule, JobFieldModule],
    exports: [DocumentModule, RoleModule, UserModule, JobModule, JobFieldModule],
})
export class CoreModule {}
