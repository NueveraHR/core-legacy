import { FilterOptions, FilterStrategy } from '@hrms-core/common/interfaces/filter';
import { Injectable } from '@nestjs/common';
import {
    AdvancedEmployeeFilterStrategy,
    ADVANCED_STRATEGY_KEYS,
} from './advanced-filter.strategy';
import { DefaultEmployeeFilterStrategy } from './default-filter.strategy';

@Injectable()
export class EmployeesFilterManagerService {
    constructor(
        private defaultStrategy: DefaultEmployeeFilterStrategy,
        private advancedStrategy: AdvancedEmployeeFilterStrategy,
    ) {}

    getStrategy(filterOptions: FilterOptions): FilterStrategy {
        if (
            Object.keys(filterOptions?.filters)
                .map(x => x.toUpperCase())
                .findIndex(x => ADVANCED_STRATEGY_KEYS.includes(x)) !== -1
        ) {
            return this.advancedStrategy;
        }

        return this.defaultStrategy;
    }
}
