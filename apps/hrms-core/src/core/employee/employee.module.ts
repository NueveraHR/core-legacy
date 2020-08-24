import { Module } from '@nestjs/common';
import { EmployeeDtoPipe } from './pipes/employee-dto.pipe';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './employee.schema';
import { EmployeeService } from './employee.service';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { EmployeeDtoReversePipe } from './pipes/employee-dto-reverse.pipe';

@Module({
    imports: [UserModule, RoleModule, MongooseModule.forFeature([{ name: Employee.name, schema: EmployeeSchema }])],
    providers: [
        //validators

        // Pipes
        EmployeeDtoPipe,
        EmployeeDtoReversePipe,

        // Services
        EmployeeService,
    ],
    exports: [EmployeeDtoPipe, EmployeeDtoReversePipe, EmployeeService],
})
export class EmployeeModule {}
