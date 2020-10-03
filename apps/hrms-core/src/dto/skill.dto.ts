import { JobFieldDto } from './job-field.dto';

export class SkillDto {
    name?: string;
    level?: number;
    type?: string;
    relatedFields?: string[] | JobFieldDto[];
}
