import { Module } from "@nestjs/common";
import { EmployeeRecordController } from "./controllers/record.controller";
import { UserModule } from "@hrms-core/modules/user/user.module";
import { EmployeeModule } from "@hrms-core/modules/employee/employee.module";

@Module({
    imports: [
        UserModule,
        EmployeeModule
    ],
    controllers: [
        EmployeeRecordController
    ],
    providers: [

    ],
})
export class EmployeeApiModule { }