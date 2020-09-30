import { Module } from '@nestjs/common';
import { UserDtoPipe } from './pipes/user-dto.pipe';
import { UserDtoValidator } from './validators/user-dto.validator';
import { UserDtoReversePipe } from './pipes/user-dto-reverse.pipe';
import { RoleModule } from '../role/role.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UserService } from './user.service';
import { AddressModule } from '../address/address.module';
import { EducationModule } from './education/education.module';
import { CertificationModule } from './certification/certification.module';
import { LanguageModule } from './language/languauge.module';

@Module({
    imports: [
        RoleModule,
        AddressModule,
        EducationModule,
        CertificationModule,
        LanguageModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [
        //validators
        UserDtoValidator,

        // Pipes
        UserDtoPipe,
        UserDtoReversePipe,

        // Services
        UserService,
    ],
    exports: [UserService, UserDtoPipe, UserDtoValidator, UserDtoReversePipe],
})
export class UserModule {}
