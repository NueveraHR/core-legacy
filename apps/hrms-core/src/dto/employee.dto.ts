import { UserDto } from './user.dto';
import { JobDto } from './job.dto';

export class EmployeeDto extends UserDto {
    workEmail?: string;
    personalEmail?: string;
    workPhone?: string;
    personalPhone?: string;
    homePhone?: string;
    jobHistory?: JobDto[];
}
