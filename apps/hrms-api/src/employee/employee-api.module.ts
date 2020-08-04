import { Module } from "@nestjs/common";
import { EmployeeRecordController } from "./controllers/records.controller";
import { EmployeeManagementModule } from "@hrms-core/modules/employee-management/employee-management.module";

@Module({
    imports: [
        EmployeeManagementModule
    ],
    controllers: [
        EmployeeRecordController
    ],
    providers: [

    ],
})
export class EmployeeApiModule { }