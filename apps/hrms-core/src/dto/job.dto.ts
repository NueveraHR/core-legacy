import { PaginateResult } from 'mongoose';

export class JobDto {
  constructor(
    public id?: string,
    public title?: string,
    public startDate?: string,
    public endDate?: string,
    public location?: string,
    public department?: string,
    public supervisor?: string,
    public salary?: number,
    public salaryFrequency?: string,
    public salaryCurrency?: string,
  ) {}
}

export type RolePaginateDto = PaginateResult<JobDto>;
