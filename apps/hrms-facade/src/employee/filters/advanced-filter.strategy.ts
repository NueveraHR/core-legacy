import { FilterOptions, FilterStrategy } from '@hrms-core/common/interfaces/filter';
import { PaginationOptions } from '@hrms-core/common/interfaces/pagination';
import { UserPaginateDto } from '@hrms-core/user/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeAdvancedFilterStrategy implements FilterStrategy {
    filter(options: {
        paginationOptions?: PaginationOptions;
        filterOptions?: FilterOptions;
    }): Promise<UserPaginateDto> {
        const { paginationOptions, filterOptions } = options;

        return null;
    }
}
