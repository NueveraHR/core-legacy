import { Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema()
export class Job extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    employmentType: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop()
    endDate: Date;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true })
    description: string;

    @Prop()
    department: string; //TODO: ref Department

    @Prop()
    salary: number;

    @Prop()
    salaryFrequency: string; //TODO: should ref class

    @Prop()
    salaryCurrency: string; //TODO: should ref class

    @Prop()
    hoursPerWeek: number;

    @Prop()
    bonusEarnings: number;

    @Prop()
    bonusFrequency: string; //TODO: should ref class
}

export const JobSchema = SchemaFactory.createForClass(Job);
