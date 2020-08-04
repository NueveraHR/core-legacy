import { Document, Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../role/role.schema";
import * as mongoosePaginate from 'mongoose-paginate';
import { UserType } from "@hrms-core/common/enums/user-type.enum";
import { ObjectID } from "mongodb";
import { Job } from "../job/job.schema";

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


    // Employee Properties 

    @Prop()
    workEmail: string;

    @Prop()
    personalEmail: string;

    @Prop()
    workPhone: string;

    @Prop()
    personalPhone: string;

    @Prop({ ref: 'Job', type: Types.ObjectId })
    currentJob: ObjectID | Job;

    //TODO: add department and address

}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(mongoosePaginate);