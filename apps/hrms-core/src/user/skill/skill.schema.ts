import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Document } from 'mongoose';
import { User } from '../user.schema';

@Schema()
export class Skill extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    level: number;

    @Prop()
    ref: string; //TODO: ref to skill description

    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    user: string;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);
