import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

@Schema()
export class Role extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop([String])
    privileges: string[];

    @Prop([String])
    extendsRoles: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.plugin(mongoosePaginate);
