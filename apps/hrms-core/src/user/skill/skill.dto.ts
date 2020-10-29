import { JobFieldDto } from '../../job-field/job-field.dto';
import { UserDto } from '../user.dto';

export class SkillDto {
    name?: string;
    level?: number;
    ref?: string;
    user?: string;
}
