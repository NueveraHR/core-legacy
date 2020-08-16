import { Document, Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../role/role.schema";
import * as mongoosePaginate from 'mongoose-paginate';
import { UserType } from "@hrms-core/common/enums/user-type.enum";
import { Employee } from "./employee/employee.schema";

@Schema()
export class User extends Document {

    @Prop({ required: true, default: UserType.EMPLOYEE })
    type: string;

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true, minlength: 8, maxlength: 8 })
    cin: string;

    @Prop()
    prefix: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop()
    gender: string;

    @Prop()
    password: string;

    @Prop()
    phone: string;

    @Prop({ ref: 'Role', type: Types.ObjectId })
    role: string | Role;

    @Prop({ ref: 'Employee', type: Types.ObjectId })
    employee: string | Employee;

    @Prop()
    candidate: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);

UserSchema.pre<User>('save', function (next) {
    if (this.type == UserType.EMPLOYEE) {
        this.employee = this.get('id')
    } else if (this.type == UserType.CANDIDATE) {
        this.candidate = this.get('id')
    }

    next();
});
