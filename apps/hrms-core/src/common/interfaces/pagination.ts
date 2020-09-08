export interface FilterOptions {
    sortBy?: string;
    sortType?: SortType;

    filters?: {
        [filterBy: string]: string;
    };
}

export enum SortType {
    ASC = 1,
    DESC = -1,
}

export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface NvrPaginateResult<T> {
    docs: T[];
    total: number;
    limit: number;
    page?: number;
    pages: number;
    nextPage?: number | null;
    prevPage?: number | null;
    pagingCounter?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    meta?: any;
}
