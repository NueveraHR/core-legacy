import { Document } from '@hrms-core/document/document.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema()
export class Certification extends Document {
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
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
