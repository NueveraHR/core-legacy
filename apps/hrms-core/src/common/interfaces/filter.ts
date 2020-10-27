import { SortType } from './pagination';

export interface FilterOptions {
    sortBy?: string;
    sortType?: SortType;

    filters?: {
        [filterBy: string]: string;
    };
}
