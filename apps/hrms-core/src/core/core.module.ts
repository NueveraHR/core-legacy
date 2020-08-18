import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { PrivilegeService } from './privilege/privilege.service';
import { HRMSConfigModule } from '@libs/config';
import { Role, RoleSchema } from './role/role.schema';
import { RoleService } from './role/role.service';
import { Job, JobSchema } from './job/job.schema';
import { Employee, EmployeeSchema } from './user/employee/employee.schema';
import { EmployeeService } from './user/employee/employee.service';
import { DocumentMangmentService } from './document-mangment/document-mangment.service';


@Module({
    imports: [
        HRMSConfigModule,
        MongooseModule.forFeature([
            { name: Role.name, schema: RoleSchema },
            { name: User.name, schema: UserSchema },
            { name: Employee.name, schema: EmployeeSchema },
            { name: Job.name, schema: JobSchema }
        ])
    ],
    providers: [
        UserService,
        EmployeeService,
        PrivilegeService,
        RoleService,
        DocumentMangmentService
    ],
    exports: [
        UserService,
        EmployeeService,
        PrivilegeService,
        RoleService
    ]
})
export class CoreModule { }
