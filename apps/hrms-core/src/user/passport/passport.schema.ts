import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';

@Schema()
export class Passport extends Document {
    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    issueDate: Date;

    @Prop({ ref: 'Document', type: SchemaTypes.ObjectId })
    document?: Document | string;
}

export const PassportSchema = SchemaFactory.createForClass(Passport);
