import { FilterInput } from '../graphql/filter.input';
import { FilterOptions } from '@hrms-core/common/interfaces/pagination';
import { SortInput } from '../graphql/sort.input';

export class FilterUtils {
    static fromInput(filterInput: FilterInput, sortInput?: SortInput): FilterOptions {
        // Init with mapped sort params values
        const filterOptions: FilterOptions = {
            sortBy: sortInput?.sortBy,
            sortType: sortInput?.sortType,
            filters: {},
        };

        const filterBy = filterInput?.filterBy ?? '*'; // if no column specified use wildcard;
        const filterValue = filterInput?.filterValue;

        // search across fields using wildcard
        if (filterValue) {
            filterOptions.filters[filterBy] = filterValue.trim();
        }

        return filterOptions;
    }
}
