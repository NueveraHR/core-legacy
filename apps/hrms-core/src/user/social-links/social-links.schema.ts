import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SocialLinks extends Document {
    @Prop({ maxlength: 50 })
    linkedIn?: string;

    @Prop({ maxlength: 20 })
    whatsApp?: string;

    @Prop({ maxlength: 60 })
    facebook?: string;

    @Prop({ maxlength: 40 })
    github?: string;

    @Prop({ maxlength: 40 })
    stackOverflow?: string;
}

export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);
