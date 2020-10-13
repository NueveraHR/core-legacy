import { PaginateModel, PaginateResult, PaginateOptions } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RoleDto } from '@hrms-core/role/role.dto';
import { Role, ROLE_SORTING_FIELDS } from './role.schema';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { FilterOptions, SortType } from '@hrms-core/common/interfaces/pagination';

@Injectable()
export class RoleService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(@InjectModel(Role.name) private readonly roleModel: PaginateModel<Role>) {}

    create(roleDto: RoleDto): Promise<Role> {
        const role = new this.roleModel(roleDto);
        return role.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    update(role: Role): Promise<Role> {
        return role.save().catch(err => {
            if (err.code == 11000) {
                // Duplicated key error.
                return Promise.reject(this.errorService.generate(43010));
            }
            return Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            );
        });
    }

    delete(id: string): Promise<boolean> {
        return this.roleModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1)
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    findAll(): Promise<Role[]> {
        return this.roleModel
            .find()
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    findAllPaginated(page = 1, limit = 10, filterOptions?: FilterOptions): Promise<PaginateResult<Role>> {
        const options = this.buildPaginateOptions(page, limit, filterOptions);
        const query = this.buildQuery(filterOptions);

        return this.roleModel.paginate(query, options).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    findByName(name: string): Promise<Role> {
        return this.roleModel
            .findOne({ name: name })
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    findById(id: string): Promise<Role> {
        return this.roleModel
            .findById(id)
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    assertExists(id: string): Promise<boolean> {
        return this.roleModel.findById(id).then(result => {
            if (!result) {
                return Promise.reject(this.errorService.generate(Errors.Role.UNKNOWN_ROLE));
            }
            return true;
        });
    }

    private buildQuery(filterOptions: FilterOptions): any {
        const query = {};
        const filters = filterOptions?.filters ?? {};

        Object.keys(filters).forEach(filterKey => {
            const value = filters[filterKey];

            if (filterKey == '*') {
                query['$or'] = ROLE_SORTING_FIELDS.map(field => {
                    return { [field]: new RegExp(`${value}`, 'i') };
                });
            } else {
                query[filterKey] = value;
            }
        });
        return query;
    }

    private buildPaginateOptions(page: number, limit: number, filterOptions: FilterOptions): PaginateOptions {
        const options: PaginateOptions = {
            page: page,
            limit: limit,
            customLabels: {
                totalDocs: 'total',
                totalPages: 'pages',
            },
        };

        options.sort = this.getSortOptions(filterOptions?.sortBy, filterOptions?.sortType);
        return options;
    }

    private getSortOptions(sortBy: string, sortType: SortType): any {
        const defaultOptions = { _id: -1 };
        if (!sortBy || !ROLE_SORTING_FIELDS.includes(sortBy)) {
            return defaultOptions;
        } else {
            return { [sortBy]: sortType ?? 1 };
        }
    }
}
