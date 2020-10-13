import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Passport extends Document {
    @Prop({ required: true, unique: true })
    number: string;

    @Prop({ required: true })
    issueDate: Date;
}

export const PassportSchema = SchemaFactory.createForClass(Passport);
