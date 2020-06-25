import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User extends Document {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    gender: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);