import { Injectable, Inject } from "@nestjs/common";
import { ErrorService } from "@hrms-core/common/error/error.service";
import { InjectModel } from "@nestjs/mongoose";
import { Employee } from "./employee.schema";
import { Model } from "mongoose";
import { User } from "../user.schema";
import { Errors } from "@hrms-core/common/error/error.const";

@Injectable()
export class EmployeeService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(@InjectModel(Employee.name) private readonly employeeModel: Model<Employee>) { }

    /**
     * Create empty employee document associated to user
     *
     */
    create(user: User): Promise<Employee> {
        const employee = new this.employeeModel();
        employee.user = user.id;

        return employee
            .save()
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }

    find(user: User): Promise<Employee> {
        return this.employeeModel
            .findOne({ user: user.id })
            .exec()
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }

    update(employee: Employee): Promise<Employee> {
        return employee
            .save()
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }


    delete(employee: Employee): Promise<boolean> {
        return this.employeeModel
            .deleteOne({ _id: employee.id })
            .exec()
            .then(result => result.deletedCount == 1)
            .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
    }

}