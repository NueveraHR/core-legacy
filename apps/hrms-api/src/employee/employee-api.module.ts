import { Module } from "@nestjs/common";
import { EmployeeRecordController } from "./controllers/records.controller";
import { EmployeeModule } from "@hrms-core/modules/employee-management/employee.module";

@Module({
    imports: [
        EmployeeModule
    ],
    controllers: [
        EmployeeRecordController
    ],
    providers: [

    ],
})
export class EmployeeApiModule { }