import { Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

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

    @Prop()
    isDefault: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
export const ROLE_SORTING_FIELDS = ['name', 'description'];
RoleSchema.plugin(mongoosePaginate);
