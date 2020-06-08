import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User extends Document {

    @Prop({ required: true, unique: true })
    username: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 