import { Injectable } from '@nestjs/common';
import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { Employee } from '../employee.schema';

@Injectable()
export class EmployeeDtoReversePipe implements DtoTransformPipe<EmployeeDto, Employee> {
    transform(employeeDto: EmployeeDto, options?: object): Employee {
        const employee = new Employee();
        return this.transformExistent(employeeDto, employee, options);
    }

    transformExistent(employeeDto: EmployeeDto, employee: Employee, options?: object): Employee {
        if (options['contactInfo']) {
            employee.workEmail = employeeDto.workEmail;
            employee.personalEmail = employeeDto.personalEmail;
            employee.workPhone = employeeDto.workPhone;
            employee.personalPhone = employeeDto.personalPhone;
        }

        return employee;
    }

    canTransform(value: EmployeeDto): boolean {
        return true;
    }
}
