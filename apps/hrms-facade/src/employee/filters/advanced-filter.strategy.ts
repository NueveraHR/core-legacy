import { FilterOptions, FilterStrategy } from '@hrms-core/common/interfaces/filter';
import { PaginationOptions } from '@hrms-core/common/interfaces/pagination';
import { JobService } from '@hrms-core/job/job.service';
import { CertificationService } from '@hrms-core/user/certification/certification.service';
import { EducationService } from '@hrms-core/user/education/education.service';
import { LanguageService } from '@hrms-core/user/language/language.service';
import { SkillService } from '@hrms-core/user/skill/skill.service';
import { UserPaginateDto } from '@hrms-core/user/user.dto';
import { User } from '@hrms-core/user/user.schema';
import { UserService } from '@hrms-core/user/user.service';
import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongodb';
import { DefaultEmployeeFilterStrategy } from './default-filter.strategy';

@Injectable()
export class AdvancedEmployeeFilterStrategy extends DefaultEmployeeFilterStrategy {
    constructor(
        protected userService: UserService,

        private skillService: SkillService,
        private languageService: LanguageService,
        private educationService: EducationService,
        private certificationService: CertificationService,
        private jobService: JobService,
    ) {
        super(userService);
    }

    async filter(options: {
        paginationOptions?: PaginationOptions;
        filterOptions?: FilterOptions;
    }): Promise<UserPaginateDto> {
        const { paginationOptions, filterOptions } = options;
        const query = await this.buildQuery(filterOptions);
        const queryOptions = super.buildQueryOptions(
            paginationOptions,
            filterOptions.sortBy,
            filterOptions.sortType,
        );

        return this.userService.findByQuery(query, queryOptions).then(result => {
            const userPaginateDto: UserPaginateDto = {
                total: result.total as number,
                pages: result.pages as number,
                page: result.page,
                limit: result.limit,
                nextPage: result.nextPage,
                prevPage: result.prevPage,
                docs: result.docs,
            };
            return userPaginateDto;
        });
    }

    protected async buildQuery(filterOptions: FilterOptions): Promise<FilterQuery<User>> {
        const employeesId = new Set<string>(); // Use set for unique values.

        for (const key in filterOptions.filters) {
            const value = filterOptions.filters[key];
            const employees = await this.findMatchingEmployees(key.toUpperCase(), value);
            employees.forEach(empId => {
                employeesId.add(empId);
            });
        }

        return { _id: { $in: Array.from(employeesId) } };
    }

    private findMatchingEmployees(key: string, searchValue: string): Promise<string[]> {
        switch (key) {
            case 'SKILLS':
                return this.findBySkills(searchValue);
            case 'LANGUAGE':
                return this.findByLanguage(searchValue);

            case 'EDUCATION':
                return this.findByEducation(searchValue);

            case 'CERTIFICATION':
                return this.findByCertification(searchValue);

            case 'JOB':
                return this.findByJob(searchValue);
        }
    }

    async findBySkills(searchValue: string): Promise<string[]> {
        if (searchValue) {
            const skills = await this.skillService.find({
                name: new RegExp(`${searchValue}`, 'i'),
            });
            return skills.map(skill => skill.user.toString());
        }
        return [];
    }

    async findByLanguage(searchValue: string): Promise<string[]> {
        return [];
    }

    async findByEducation(searchValue: string): Promise<string[]> {
        return [];
    }

    async findByCertification(searchValue: string): Promise<string[]> {
        if (searchValue) {
            const skills = await this.certificationService.find({
                name: new RegExp(`${searchValue}`, 'i'),
            });
            return skills.map(skill => skill.user.toString());
        }
        return [];
    }

    async findByJob(searchValue: string): Promise<string[]> {
        return [];
    }
}

export const ADVANCED_STRATEGY_KEYS = [
    'SKILLS',
    'LANGUAGE',
    'EDUCATION',
    'CERTIFICATION',
    'JOB',
];
