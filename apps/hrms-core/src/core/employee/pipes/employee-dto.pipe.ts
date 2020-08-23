import { Injectable } from '@nestjs/common';
import { UserDtoPipe } from '@hrms-core/core/user/pipes/user-dto.pipe';
import { User } from '@hrms-core/core/user/user.schema';
import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { Employee } from '@hrms-core/core/employee/employee.schema';

@Injectable()
export class EmployeeDtoPipe extends UserDtoPipe implements DtoTransformPipe<User, EmployeeDto> {
    transform(user: User, options?: { detailed: boolean }): EmployeeDto {
        const employeeDto = super.transform(user, options) as EmployeeDto;
        if (options?.detailed) {
            const employee = user.employee as Employee;

            employeeDto.workEmail = employee?.workEmail;
            employeeDto.personalEmail = employee?.personalEmail;
            employeeDto.workPhone = employee?.workPhone;
            employeeDto.personalPhone = employee?.personalPhone;
        }

        return employeeDto;
    }

    transformExistent(user: User, employeeDto: EmployeeDto, options?: object): EmployeeDto {
        return null;
    }

    canTransform(value: User): boolean {
        return true;
    }
}
