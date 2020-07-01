import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Privileges } from "../privilege/privilege.model";

@Schema()
export class Role extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    privileges: Privileges;

    @Prop([String])
    extendsRoles: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);