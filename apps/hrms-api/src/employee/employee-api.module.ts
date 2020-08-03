import { Module } from "@nestjs/common";
import { EmployeeRecordController } from "./controllers/records.controller";
import { UserManagementModule } from "@hrms-core/modules/user-management/user-management.module";

@Module({
    imports: [
        UserManagementModule
    ],
    controllers: [
        EmployeeRecordController
    ],
    providers: [

    ],
})
export class EmployeeApi { }