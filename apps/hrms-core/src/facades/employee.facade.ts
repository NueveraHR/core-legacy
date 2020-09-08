import { UserFacade, UserPaginateDto } from './user.facade';
import { Inject, Injectable } from '@nestjs/common';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { UserType } from '@hrms-core/common/enums/user-type.enum';
import { EmployeeDto } from '@hrms-core/dto/employee.dto';
import { LoggerService } from '@libs/logger';
import { UserService } from '@hrms-core/core/user/user.service';
import { RoleService } from '@hrms-core/core/role/role.service';
import { EmployeeDtoPipe } from '../core/employee/pipes/employee-dto.pipe';
import { UserDtoValidator } from '@hrms-core/core/user/validators/user-dto.validator';
import { UserDtoReversePipe } from '@hrms-core/core/user/pipes/user-dto-reverse.pipe';
import { EmployeeService } from '@hrms-core/core/employee/employee.service';
import { JobService } from '@hrms-core/core/job/job.service';
import { JobDto } from '@hrms-core/dto/job.dto';
import { EmployeeDtoReversePipe } from '@hrms-core/core/employee/pipes/employee-dto-reverse.pipe';
import { UserDto } from '@hrms-core/dto/user.dto';
import { AddressService } from '@hrms-core/core/address/address.service';
import { PaginationOptions, FilterOptions } from '@hrms-core/common/interfaces/pagination';

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
        addressService: AddressService,
        private employeeDtoReversePipe: EmployeeDtoReversePipe,
        private employeeService: EmployeeService,
        private jobService: JobService,
    ) {
        super(logger, userDtoValidator, employeeDtoPipe, userDtoReversePipe, userService, roleService, addressService);
    }

    list(paginationOptions: PaginationOptions, filterOptions: FilterOptions = {}): Promise<UserPaginateDto> {
        if (!filterOptions.filters) {
            filterOptions.filters = {};
        }

        filterOptions.filters['type'] = UserType.EMPLOYEE;
        return super.list(paginationOptions, filterOptions);
    }

    create(employeeDto: EmployeeDto): Promise<EmployeeDto> {
        return this.employeeService
            .create(employeeDto)
            .then(emp => {
                employeeDto['_id'] = emp.id;
                return super.create(employeeDto);
            })
            .catch(err => {
                this.employeeService.delete(employeeDto['_id']); // on failure delete possible created employee.
                return Promise.reject(err);
            });
    }

    async update(employeeId: string, employeeDto: EmployeeDto): Promise<EmployeeDto> {
        await super.update(employeeId, employeeDto);
        let employeeToUpdate = await this.employeeService.findById(employeeId);
        employeeToUpdate = this.employeeDtoReversePipe.transformExistent(employeeDto, employeeToUpdate);
        return this.employeeService
            .update(employeeToUpdate)
            .then(() => this.details(employeeId) as Promise<EmployeeDto>);
    }

    updateBasicInfo(employeeId: string, employeeDto: EmployeeDto): Promise<EmployeeDto> {
        return super.update(employeeId, employeeDto, true);
    }

    async updateContactInfo(employeeId: string, employeeDto: EmployeeDto): Promise<EmployeeDto> {
        let employeeToUpdate = await this.employeeService.findById(employeeId);
        employeeToUpdate = this.employeeDtoReversePipe.transformExistent(employeeDto, employeeToUpdate, {
            contactInfo: true,
        });

        return this.employeeService
            .update(employeeToUpdate)
            .then(() => this.details(employeeId) as Promise<EmployeeDto>);
    }

    async jobHistory(employeeId: string): Promise<JobDto> {
        const jobHistory = await this.employeeService.getJobHistory(employeeId);

        return this.jobService.find({ id: { $in: jobHistory } }) as JobDto;
        //.then(job => this.jobDtoPipe.transform(job));
    }
}
