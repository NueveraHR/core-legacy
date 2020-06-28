import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { PrivilegeService } from './privilege/privilege.service';
import { HRMSConfigModule } from '@libs/config';


@Module({
    imports: [
        HRMSConfigModule,
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ])
    ],
    providers: [
        UserService,
        PrivilegeService
    ],
    exports: [
        UserService,
        PrivilegeService
    ]
})
export class CoreModule { }
