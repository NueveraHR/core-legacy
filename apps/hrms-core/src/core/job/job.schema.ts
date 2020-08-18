import { Employee } from './../user/employee/employee.schema';
import { Document, Types } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

@Schema()
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  department: string; //TODO: ref Department

  @Prop({ ref: 'Employee', type: Types.ObjectId })
  supervisor: string | Employee;
  
  @Prop({ required: true })
  salary: number;
 
 @Prop()
  salaryFrequency: string; //TODO: should ref class
  
  @Prop()
  salaryCurrency: string; //TODO: should ref class
}

export const JobSchema = SchemaFactory.createForClass(Job);
