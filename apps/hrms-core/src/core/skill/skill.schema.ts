import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { JobField } from '../job-field/job-field.schema';

@Schema()
export class Skill extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    level: number;

    @Prop()
    type: string;

    @Prop([{ ref: 'JobField', type: SchemaTypes.ObjectId }])
    relatedFields: string[] | JobField[];
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
