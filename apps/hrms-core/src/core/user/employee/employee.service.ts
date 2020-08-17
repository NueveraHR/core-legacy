import { Injectable, Inject } from "@nestjs/common";
import { ErrorService } from "@hrms-core/common/error/error.service";
import { InjectModel } from "@nestjs/mongoose";
import { Employee } from "./employee.schema";
import { Model } from "mongoose";
import { User } from "../user.schema";
import { Errors } from "@hrms-core/common/error/error.const";
import { ObjectId } from "mongodb";
import { EmployeeDto } from "@hrms-core/dto/employee.dto";

@Injectable()
export class EmployeeService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<Employee>) { }

    /**
     * Create empty employee document associated to user
     *
     */
    create(employeeDto: EmployeeDto): Promise<Employee> {
        const employee = new this.employeeModel(employeeDto);

        return employee
            .save()
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }

    find(employeeId: string): Promise<Employee> {
        return this.employeeModel
            .findOne({ _id: employeeId })
            .exec()
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }

    update(employee: Employee): Promise<Employee> {
        return employee
            .save()
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }


    delete(employeeId: string): Promise<boolean> {
        return this.employeeModel
            .deleteOne({ _id: employeeId })
            .exec()
            .then(result => result.deletedCount == 1)
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }

}