import { UserFacade, PaginationOptions, UserPaginateDto } from "../../user/facades/user.facade";
import { Inject, Injectable } from "@nestjs/common";
import { ErrorService } from "@hrms-core/common/error/error.service";
import { UserType } from "@hrms-core/common/enums/user-type.enum";
import { EmployeeDto } from "@hrms-core/dto/employee.dto";
import { LoggerService } from "@libs/logger";
import { UserService } from "@hrms-core/core/user/user.service";
import { RoleService } from "@hrms-core/core/role/role.service";
import { EmployeeDtoPipe } from "../pipes/employee-dto.pipe";
import { UserDtoValidator } from "@hrms-core/modules/user/validators/user-dto.validator";
import { UserDtoReversePipe } from "@hrms-core/modules/user/pipes/user-dto-reverse.pipe";
import { EmployeeService } from "@hrms-core/core/user/employee/employee.service";


@Injectable()
export class EmployeeFacade extends UserFacade {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        logger: LoggerService,
        userDtoValidator: UserDtoValidator,
        employeeDtoPipe: EmployeeDtoPipe,
        userDtoReversePipe: UserDtoReversePipe,
        userService: UserService,
        roleService: RoleService,
        private employeeService: EmployeeService,
    ) {
        super(logger, userDtoValidator, employeeDtoPipe,
            userDtoReversePipe, userService, roleService);
    }

    list(paginationOptions?: PaginationOptions, filterCriteria = {}): Promise<UserPaginateDto> {
        filterCriteria['type'] = UserType.EMPLOYEE;
        return super.list(paginationOptions, filterCriteria);
    }

    create(employeeDto: EmployeeDto): Promise<EmployeeDto> {
        return this.employeeService.create(employeeDto)
            .then(emp => {
                employeeDto['_id'] = emp.id;
                return super.create(employeeDto);
            })
            .catch(err => {
                this.employeeService.delete(employeeDto['_id']); // on failure delete possible created employee.
                return Promise.reject(err)
            });
    }

}