import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document as MongoDocument } from 'mongoose';
import { Document } from '@hrms-core/document/document.schema';

@Schema()
export class Passport extends MongoDocument {
    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    issueDate: Date;

    @Prop({ ref: 'Document', type: SchemaTypes.ObjectId })
    document?: Document;
}

export const PassportSchema = SchemaFactory.createForClass(Passport);
