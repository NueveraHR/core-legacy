import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Education extends Document {
    @Prop({ required: true })
    school: string;

    @Prop({ required: true })
    degree: string;

    @Prop()
    field: string;

    @Prop()
    startYear: Date;

    @Prop()
    endYear: Date;

    @Prop()
    description: string;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
