import { Module } from '@nestjs/common';
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
import { SkillModule } from './skill/skill.module';
import { SocialLinksModule } from './social-links/social-links.module';
import { PassportModule } from './passport/passport.module';

@Module({
    imports: [
        RoleModule,
        AddressModule,
        SkillModule,
        EducationModule,
        CertificationModule,
        LanguageModule,
        SocialLinksModule,
        PassportModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [
        //validators
        UserDtoValidator,

        // Pipes
        UserDtoReversePipe,

        // Services
        UserService,
    ],
    exports: [
        AddressModule,
        SkillModule,
        EducationModule,
        CertificationModule,
        LanguageModule,
        SocialLinksModule,
        PassportModule,
        UserService,
        UserDtoValidator,
        UserDtoReversePipe,
    ],
})
export class UserModule {}
