import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SocialLinks extends Document {
    @Prop({ maxlength: 100 })
    linkedIn?: string;

    @Prop({ maxlength: 100 })
    whatsApp?: string;

    @Prop({ maxlength: 100 })
    facebook?: string;

    @Prop({ maxlength: 100 })
    github?: string;

    @Prop({ maxlength: 100 })
    stackOverflow?: string;
}

export const SocialLinksSchema = SchemaFactory.createForClass(SocialLinks);
