import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '../user/user.schema';

@Schema()
export class Document extends mongoose.Document {
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    path: string;

    @Prop()
    fullPath: string;

    @Prop()
    type: string;

    @Prop({ ref: 'user', type: mongoose.Types.ObjectId })
    user: User;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

DocumentSchema.plugin(mongoosePaginate);
