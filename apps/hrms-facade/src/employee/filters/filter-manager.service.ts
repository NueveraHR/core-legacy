import { FilterOptions, FilterStrategy } from '@hrms-core/common/interfaces/filter';
import { Injectable } from '@nestjs/common';
import { EmployeeAdvancedFilterStrategy } from './advanced-filter.strategy';
import { EmployeeDefaultFilterStrategy } from './default-filter.strategy';

@Injectable()
export class EmployeesFilterManagerService {
    constructor(
        private defaultStrategy: EmployeeDefaultFilterStrategy,
        private advancedStrategy: EmployeeAdvancedFilterStrategy,
    ) {}

    getStrategy(filterOptions: FilterOptions): FilterStrategy {
        if (
            Object.keys(filterOptions?.filters)
                .map(x => x.toUpperCase())
                .findIndex(x => advancedStrategyKeys.includes(x)) !== -1
        ) {
            return this.advancedStrategy;
        }

        return this.defaultStrategy;
    }
}

const advancedStrategyKeys = ['SKILLS', 'LANGUAGE', 'EDUCATION', 'CERTIFICATION', 'JOB'];
