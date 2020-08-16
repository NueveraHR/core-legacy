import { Module } from "@nestjs/common";
import { CoreModule } from "@hrms-core/core/core.module";
import { EmployeeDtoPipe } from "./pipes/employee-dto.pipe";
import { EmployeeFacade } from "./facades/employee.facade";
import { UserModule } from "../user/user.module";


@Module({
    imports: [
        CoreModule,
        UserModule,
    ],
    providers: [
        //validators

        // Pipes
        EmployeeDtoPipe,

        // Facades
        EmployeeFacade,
    ],
    exports: [
        EmployeeFacade,
    ]
})
export class EmployeeModule { }
