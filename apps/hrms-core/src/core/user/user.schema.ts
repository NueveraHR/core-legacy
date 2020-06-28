import { Document, Types } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "../role/role.schema";

@Schema()
export class User extends Document {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true, minlength: 8, maxlength: 8 })
    cin: string;

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
    roleId: string | Role;

}

export const UserSchema = SchemaFactory.createForClass(User);