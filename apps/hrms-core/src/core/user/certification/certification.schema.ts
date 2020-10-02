import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const CertificationSchema = SchemaFactory.createForClass(Certification);
