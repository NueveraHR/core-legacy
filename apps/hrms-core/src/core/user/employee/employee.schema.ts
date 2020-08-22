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

    @Prop({ ref: 'Employee', type: Types.ObjectId })
    supervisor: string | Employee;

    @Prop({ ref: 'Job', type: Types.ObjectId })
    currentJob: string | Job;

    @Prop([{ ref: 'Job', type: Types.ObjectId }])
    jobHistory;

    // @Prop({ref: 'Department', })
    //TODO: add department and address

}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

const populators = {
    supervisor: function (next) {
        this.populate('supervisor');
    },
    currentJob: function (next) {
        this.populate('currentJob');
    },
    jobHistory: function (next) {
        this.populate('jobHistory');
    },
}

EmployeeSchema.pre<Employee>('findOne', populators.supervisor);
EmployeeSchema.pre<Employee>('findOne', populators.currentJob);
EmployeeSchema.pre<Employee>('findOne', populators.jobHistory);