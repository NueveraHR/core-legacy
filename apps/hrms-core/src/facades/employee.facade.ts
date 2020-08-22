import { UserFacade, PaginationOptions, UserPaginateDto } from "./user.facade";
import { Inject, Injectable } from "@nestjs/common";
import { ErrorService } from "@hrms-core/common/error/error.service";
import { UserType } from "@hrms-core/common/enums/user-type.enum";
import { EmployeeDto } from "@hrms-core/dto/employee.dto";
import { LoggerService } from "@libs/logger";
import { UserService } from "@hrms-core/core/user/user.service";
import { RoleService } from "@hrms-core/core/role/role.service";
import { EmployeeDtoPipe } from "../core/employee/pipes/employee-dto.pipe";
import { UserDtoValidator } from "@hrms-core/core/user/validators/user-dto.validator";
import { UserDtoReversePipe } from "@hrms-core/core/user/pipes/user-dto-reverse.pipe";
import { EmployeeService } from "@hrms-core/core/employee/employee.service";
import { JobService } from "@hrms-core/core/job/job.service";
import { JobDto } from "@hrms-core/dto/job.dto";


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
        private jobService: JobService,
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

    async update(employeeId: string, employeeDto: EmployeeDto): Promise<EmployeeDto> {

        const employeeToUpdate = await this.employeeService.findById(id)
        await super.update(id, employeeDto)
        // TODO: replace with EmployeeDtoReversePipe
        employeeToUpdate.workEmail = employeeDto.workEmail;
        employeeToUpdate.personalEmail = employeeDto.personalEmail;
        employeeToUpdate.workPhone = employeeDto.workPhone;
        employeeToUpdate.personalPhone = employeeDto.personalPhone;

        return this.employeeService.update(employeeToUpdate)
            .then(emp => super.details(employeeId) as Promise<EmployeeDto>)
    }

    async jobHistory(employeeId: string): Promise<JobDto> {
        const jobHistory = await this.employeeService.getJobHistory(employeeId);

        return this.jobService.find({ 'id': { $in: jobHistory } }) as JobDto
            //.then(job => this.jobDtoPipe.transform(job));
    }
}