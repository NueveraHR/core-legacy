import { Module } from "@nestjs/common";
import { EmployeeRecordController } from "./controllers/record.controller";
import { EmployeeModule } from "@hrms-core/modules/employee/employee.module";

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