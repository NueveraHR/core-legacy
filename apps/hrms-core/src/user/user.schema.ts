import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../role/role.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { Address } from '../address/address.schema';
import { Education } from './education/education.schema';
import { Certification } from './certification/certification.schema';
import { Language } from './language/language.schema';
import { SchemaTypes } from 'mongoose';
import { Skill } from './skill/skill.schema';
import { SocialLinks } from './social-links/social-links.schema';
import { Passport } from './passport/passport.schema';
import { Job } from '../job/job.schema';

@Schema()
export class User extends Document {
    // TODO: replace with SchemaTypes
    @Prop({ type: String, required: true, default: UserType.EMPLOYEE })
    type: UserType;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ unique: true, sparse: true, minlength: 8, maxlength: 8 })
    cin: string;

    @Prop()
    prefix: string;

    @Prop()
    firstName: string;

    @Prop()
    preferredName: string;

    @Prop()
    middleName: string;

    @Prop()
    lastName: string;

    @Prop()
    gender: string;

    @Prop()
    nationality: string;

    @Prop()
    birthDate: Date;

    @Prop()
    password: string;

    @Prop()
    phone: string;

    @Prop()
    homePhone: string;

    @Prop()
    picture: string;

    @Prop()
    title: string;

    @Prop()
    about: string;

    @Prop({ default: false })
    accountActivated: boolean;

    @Prop({ ref: 'Passport', type: SchemaTypes.ObjectId })
    passport: string | Passport;

    @Prop({ ref: 'Address', type: SchemaTypes.ObjectId })
    address: string | Address;

    @Prop({ ref: 'Role', type: SchemaTypes.ObjectId })
    role: string | Role;

    @Prop([{ ref: 'Skill', type: SchemaTypes.ObjectId }])
    skills: string[] | Skill[];

    @Prop({ ref: 'SocialLinks', type: SchemaTypes.ObjectId })
    socialLinks: string | SocialLinks;

    @Prop([{ ref: 'Education', type: SchemaTypes.ObjectId }])
    educationHistory: string[] | Education[];

    @Prop([{ ref: 'Certification', type: SchemaTypes.ObjectId }])
    certifications: string[] | Certification[];

    @Prop([{ ref: 'Language', type: SchemaTypes.ObjectId }])
    languages: string[] | Language[];

    @Prop([{ ref: 'Job', type: SchemaTypes.ObjectId }])
    jobHistory: string[] | Job[];

    // --------------------------- Employment -------------------------------

    @Prop({ ref: 'User', type: Types.ObjectId })
    supervisor: string | User;

    @Prop({ ref: 'Job', type: Types.ObjectId })
    currentJob: string | Job;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const USER_SORTING_FIELDS = ['email', 'firstName', 'lastName'];

UserSchema.plugin(mongoosePaginate);

const populateStandardData = function(next) {
    this.populate('role');
    this.populate('address');
    this.populate({ path: 'educationHistory', populate: { path: 'document' } });
    this.populate({ path: 'certifications', populate: { path: 'document' } });
    this.populate('languages');
    this.populate('skills');
    this.populate('socialLinks');
    this.populate({ path: 'passport', populate: { path: 'document' } });
    this.populate({ path: 'jobHistory', populate: { path: 'document' } });

    next();
};

// TODO: [Optimization] populate on demand
UserSchema.pre<User>('find', populateStandardData);
UserSchema.pre<User>('findOne', populateStandardData);
UserSchema.pre<User>('findOneAndUpdate', populateStandardData);
