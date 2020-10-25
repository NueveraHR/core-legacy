import { DocumentDto } from '@hrms-core/document/document.dto';
import { PaginateResult } from 'mongoose';

export class JobDto {
    id?: string;
    title?: string;
    employmentType?: string;

    startDate?: Date;
    endDate?: Date;
    location?: string;
    description?: string;

    department?: string;
    salary?: number;
    salaryFrequency?: string;
    salaryCurrency?: string;
    hoursPerWeek?: number;
    bonusEarnings?: number;
    bonusFrequency?: string;
    document?: DocumentDto;

    constructor(id: string) {
        this.id = id;
    }
}

export type RolePaginateDto = PaginateResult<JobDto>;
