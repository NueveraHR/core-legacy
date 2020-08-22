import { JobService } from './job/job.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HRMSConfigModule } from '@libs/config';
import { Job, JobSchema } from './job/job.schema';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    HRMSConfigModule,
    MongooseModule.forFeature([
      { name: Job.name, schema: JobSchema },
    ]),

    RoleModule,
    UserModule,
    EmployeeModule
  ],
  providers: [
    JobService,
  ],
  exports: [
    RoleModule,
    UserModule,
    EmployeeModule
  ]
})
export class CoreModule { }
