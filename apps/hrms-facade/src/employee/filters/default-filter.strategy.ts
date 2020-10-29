import { FilterOptions, FilterStrategy } from '@hrms-core/common/interfaces/filter';
import { PaginationOptions, SortType } from '@hrms-core/common/interfaces/pagination';
import { UserPaginateDto } from '@hrms-core/user/user.dto';
import { UserService } from '@hrms-core/user/user.service';
import { Injectable } from '@nestjs/common';
import { PaginateOptions } from 'mongoose';

@Injectable()
export class DefaultEmployeeFilterStrategy implements FilterStrategy {
    constructor(protected userService: UserService) {}

    filter(options: {
        paginationOptions?: PaginationOptions;
        filterOptions?: FilterOptions;
    }): Promise<UserPaginateDto> {
        const { paginationOptions, filterOptions } = options;

        const query = this.buildQuery(filterOptions);
        const queryOptions = this.buildQueryOptions(
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

    protected buildQuery(filterOptions: FilterOptions): any {
        const query = {};
        const filters = filterOptions?.filters ?? {};

        Object.keys(filters).forEach(filterKey => {
            const value = filters[filterKey];

            if (filterKey == '*') {
                query['$or'] = DEFAULT_STRATEGY_KEYS.map(field => {
                    return { [field]: new RegExp(`${value}`, 'i') };
                });
            } else {
                query[filterKey] = value;
            }
        });
        return query;
    }

    protected buildQueryOptions(
        pagination: PaginationOptions,
        sortBy?: string,
        sortType?: SortType,
    ): PaginateOptions {
        const { page, limit } = pagination;
        const options: PaginateOptions = {
            page: page,
            limit: limit,
            customLabels: {
                totalDocs: 'total',
                totalPages: 'pages',
            },
        };

        options.sort = this.getSortOptions(sortBy, sortType);
        return options;
    }

    private getSortOptions(sortBy: string, sortType: SortType): any {
        const defaultOptions = { _id: -1 };
        if (!sortBy || !DEFAULT_STRATEGY_KEYS.includes(sortBy)) {
            return defaultOptions;
        } else {
            return { [sortBy]: sortType ?? 1 };
        }
    }
}

export const DEFAULT_STRATEGY_KEYS = ['email', 'firstName', 'lastName'];
