import * as mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ObjectId } from 'mongodb';

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

    @Prop({ type: ObjectId })
    userId: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);

DocumentSchema.plugin(mongoosePaginate);
