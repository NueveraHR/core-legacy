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
import { AddressService } from '@hrms-core/core/address/address.service';
import { PaginationOptions, FilterOptions } from '@hrms-core/common/interfaces/pagination';
import { EducationService } from '@hrms-core/core/user/education/education.service';
import { CertificationService } from '@hrms-core/core/user/certification/certification.service';
import { LanguageService } from '@hrms-core/core/user/language/language.service';
import { SkillService } from '@hrms-core/core/skill/skill.service';

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
        educationService: EducationService,
        certificationService: CertificationService,
        languageService: LanguageService,
        skillService: SkillService,
        private employeeDtoReversePipe: EmployeeDtoReversePipe,
        private employeeService: EmployeeService,
        private jobService: JobService,
    ) {
        super(
            logger,
            userDtoValidator,
            employeeDtoPipe,
            userDtoReversePipe,
            userService,
            roleService,
            addressService,
            educationService,
            certificationService,
            languageService,
            skillService,
        );
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

    async update(employeeDto: EmployeeDto): Promise<EmployeeDto> {
        await super.update(employeeDto);
        const emp = await this.employeeService.findById(employeeDto.id);
        this.employeeDtoReversePipe.transformExistent(employeeDto, emp);
        await this.employeeService.update(emp);
        return this.details(employeeDto.id) as Promise<EmployeeDto>;
    }

    async addJob(employeeId: string, jobDto: JobDto): Promise<JobDto> {
        //TODO: validate
        const job = await this.jobService.create(jobDto);
        return this.employeeService.attachJob(employeeId, job);
    }
}
