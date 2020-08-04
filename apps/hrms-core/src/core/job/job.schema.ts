import { Document } from "mongoose";
import { Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Job extends Document {
    title: string;

    startDate: Date;

    endDate: Date;

    location: string;

    department: string; //TODO: ref Department

    supervisor: string; //TODO: ref user

    salary: number;

    salaryFrequency: string; //TODO: should ref class

    salaryCurrency: string; //TODO: should ref class
}

export const JobSchema = SchemaFactory.createForClass(Job);