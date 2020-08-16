import { UserFacade, PaginationOptions, UserPaginateDto } from "./user.facade";
import { Inject } from "@nestjs/common";
import { ErrorService } from "@hrms-core/common/error/error.service";
import { UserType } from "@hrms-core/common/enums/user-type.enum";
import { EmployeeDto } from "@hrms-core/dto/employee.dto";
import { LoggerService } from "@libs/logger";
import { UserService } from "@hrms-core/core/user/user.service";
import { RoleService } from "@hrms-core/core/role/role.service";


export class EmployeeFacade extends UserFacade {
    @Inject(ErrorService) errorService: ErrorService;

    // constructor(
    //     private logger: LoggerService,
    //     private employeeDtoValidator: EmployeeDtoValidator,
    //     private employeeDtoPipe: EmployeeDtoPipe,
    //     private employeeDtoReversePipe: EmployeeDtoReversePipe,
    //     private userService: UserService,
    //     private roleService: RoleService,
    // ) {
    //     super(logger, employeeDtoValidator, employeeDtoPipe,
    //         employeeDtoReversePipe, userService, roleService);
    // }

    list(paginationOptions?: PaginationOptions, filterCriteria = {}): Promise<UserPaginateDto> {
        filterCriteria['type'] = UserType.EMPLOYEE;
        return super.list(paginationOptions, filterCriteria);
    }

    // async create(employeeDto: EmployeeDto): Promise<EmployeeDto> {

    // }

}