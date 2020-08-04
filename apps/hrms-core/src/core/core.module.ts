import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { PrivilegeService } from './privilege/privilege.service';
import { HRMSConfigModule } from '@libs/config';
import { Role, RoleSchema } from './role/role.schema';
import { RoleService } from './role/role.service';
import { Job, JobSchema } from './job/job.schema';


@Module({
    imports: [
        HRMSConfigModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Role.name, schema: RoleSchema },
            { name: Job.name, schema: JobSchema }
        ])
    ],
    providers: [
        UserService,
        PrivilegeService,
        RoleService
    ],
    exports: [
        UserService,
        PrivilegeService,
        RoleService
    ]
})
export class CoreModule { }
