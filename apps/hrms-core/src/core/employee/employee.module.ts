import { Module } from '@nestjs/common';
import { EmployeeDtoPipe } from './pipes/employee-dto.pipe';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './employee.schema';
import { EmployeeService } from './employee.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';


@Module({
    imports: [
        UserModule,
        RoleModule,

        MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }])
    ],
    providers: [
        //validators

        // Pipes
        EmployeeDtoPipe,

        // Services
        EmployeeService
    ],
    exports: [
        EmployeeDtoPipe,
        EmployeeService,
    ]
})
export class EmployeeModule { }
