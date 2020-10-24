import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Language extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    proficiency: number;

    @Prop({ default: false })
    isPreferred: boolean;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
