import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Job } from "@hrms-core/core/job/job.schema";
import { Types, Document } from "mongoose";

@Schema()
export class Employee extends Document {

    @Prop()
    workEmail: string;

    @Prop()
    personalEmail: string;

    @Prop()
    workPhone: string;

    @Prop()
    personalPhone: string;

    @Prop({ ref: 'Job', type: Types.ObjectId })
    currentJob: Job | string;

    @Prop({ ref: 'Employee', type: Types.ObjectId })
    supervisor: string | Employee;
    
    // @Prop({ref: 'Department', })
    //TODO: add department and address

}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
