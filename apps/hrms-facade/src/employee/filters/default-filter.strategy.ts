import { FilterOptions, FilterStrategy } from '@hrms-core/common/interfaces/filter';
import { PaginationOptions } from '@hrms-core/common/interfaces/pagination';
import { UserPaginateDto } from '@hrms-core/user/user.dto';
import { UserService } from '@hrms-core/user/user.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeDefaultFilterStrategy implements FilterStrategy {
    constructor(private userService: UserService) {}

    filter(options: {
        paginationOptions?: PaginationOptions;
        filterOptions?: FilterOptions;
    }): Promise<UserPaginateDto> {
        const { paginationOptions, filterOptions } = options;

        return this.userService
            .findAllPaginated(
                paginationOptions.page,
                paginationOptions.limit,
                filterOptions,
            )
            .then(result => {
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
}
