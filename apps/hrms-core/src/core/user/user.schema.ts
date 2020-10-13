import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Role } from '../role/role.schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { Employee } from '../employee/employee.schema';
import { Address } from '../address/address.schema';
import { Education } from './education/education.schema';
import { Certification } from './certification/certification.schema';
import { Language } from './language/language.schema';
import { SchemaTypes } from 'mongoose';
import { Skill } from './skill/skill.schema';
import { SocialLinks } from './social-links/social-links.schema';
import { Passport } from './passport/passport.schema';

@Schema()
export class User extends Document {
    @Prop({ required: true, default: UserType.EMPLOYEE })
    type: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ unique: true, minlength: 8, maxlength: 8 })
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
    picture: string;

    @Prop()
    title: string;

    @Prop()
    about: string;

    @Prop({ ref: 'Passport', type: SchemaTypes.ObjectId })
    passport: string | Passport;

    @Prop({ ref: 'Address', type: Types.ObjectId }) // TODO: replace with SchemaTypes
    address: string | Address;

    @Prop({ ref: 'Role', type: Types.ObjectId })
    role: string | Role;

    @Prop({ ref: 'Employee', type: Types.ObjectId })
    employee: string | Employee;

    @Prop()
    candidate: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
export const USER_SORTING_FIELDS = ['email', 'firstName', 'lastName'];

UserSchema.plugin(mongoosePaginate);

UserSchema.pre<User>('save', function(next) {
    if (this.type == UserType.EMPLOYEE) {
        this.employee = this.get('id');
    } else if (this.type == UserType.CANDIDATE) {
        this.candidate = this.get('id');
    }

    next();
});

const populateStandardData = function(next) {
    this.populate('employee');
    this.populate('candidate');
    this.populate('role');
    this.populate('address');
    this.populate('educationHistory');
    this.populate('certifications');
    this.populate('languages');
    this.populate('skills');
    this.populate('socialLinks');
    this.populate('passport');

    next();
};

// TODO: [Optimization] populate on demand
UserSchema.pre<User>('find', populateStandardData);
UserSchema.pre<User>('findOne', populateStandardData);
UserSchema.pre<User>('findOneAndUpdate', populateStandardData);
