import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class JobField extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ ref: 'JobField', type: SchemaTypes.ObjectId })
    parent: JobField;
}

export const JobFieldSchema = SchemaFactory.createForClass(JobField);
