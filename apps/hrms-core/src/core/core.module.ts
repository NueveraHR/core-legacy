import { Module } from '@nestjs/common';
import { HRMSConfigModule } from '@libs/config';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [
    HRMSConfigModule,

    RoleModule,
    UserModule,
    EmployeeModule
  ],
  exports: [
    RoleModule,
    UserModule,
    EmployeeModule
  ]
})
export class CoreModule { }
