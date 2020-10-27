import { SortType } from './pagination';
export interface FilterOptions {
    sortBy?: string;
    sortType?: SortType;

    filters?: {
        [filterBy: string]: string;
    };
}

export interface FilterStrategy {
    filter(options: any): any;
}
