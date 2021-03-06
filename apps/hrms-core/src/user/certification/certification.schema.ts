import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document as MongoDocument } from 'mongoose';
import { Document } from '@hrms-core/document/document.schema';

@Schema()
export class Certification extends MongoDocument {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    issuingOrganization: string;

    @Prop({ required: true })
    date: Date;

    @Prop()
    expiresOn?: Date;

    @Prop({ ref: 'Document', type: SchemaTypes.ObjectId })
    document?: Document;

    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    user: string;
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
