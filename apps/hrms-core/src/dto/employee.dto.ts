import { UserDto } from './user.dto';

export class EmployeeDto extends UserDto {
    public workEmail?: string;
    public personalEmail?: string;
    public workPhone?: string;
    public personalPhone?: string;
    public homePhone?: string;
}
