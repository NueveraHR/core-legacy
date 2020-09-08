import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, USER_SORTING_FIELDS } from './user.schema';
import { PaginateModel, PaginateResult, PaginateOptions } from 'mongoose';
import { UserDto } from '@hrms-core/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/role.schema';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { SortType, FilterOptions } from '@hrms-core/common/interfaces/pagination';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(@InjectModel(User.name) private readonly userModel: PaginateModel<User>) {}

    /**
     * Create user model based on a userDTO
     *
     */
    async create(userDTO: UserDto): Promise<User> {
        let user = new this.userModel(userDTO);
        await this.hashPassword(user).then(updatedUser => (user = updatedUser));

        return user.save().catch(err => {
            if (err.code == 11000) {
                // Duplicated key error.
                return Promise.reject(this.errorService.generate(Errors.User.CREATE_DUPLICATED));
            }
            return Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            );
        });
    }

    /**
     * Update existing user model
     *
     */
    async update(user: User): Promise<User> {
        if (user.isModified('password')) {
            await this.hashPassword(user).then(updatedUser => (user = updatedUser));
        }

        return user.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    /**
     * Find all users in DB without applying any filters
     *
     */
    async findAll(options?: { populate?: string[] }): Promise<User[]> {
        let resp: Promise<User[]>;

        if (!options?.populate?.length) {
            resp = this.userModel.find().exec();
        } else {
            resp = this.userModel
                .find()
                .populate(options.populate.join(' '))
                .exec();
        }

        return resp.catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    findAllPaginated(page = 1, limit = 10, filterOptions?: FilterOptions): Promise<PaginateResult<User>> {
        const options = this.buildPaginateOptions(page, limit, filterOptions);

        return this.userModel.paginate(filterOptions.filters ?? {}, options).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    /**
     * Find a single matching user for given id
     *
     */
    findById(id: string): Promise<User> {
        return this.userModel
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

    /**
     * Find a single matching user for a given username
     *
     */
    async findByUsername(username: string): Promise<User> {
        const criteria = { username: username };
        return this.userModel
            .findOne(criteria)
            .exec()
            .catch(err =>
                Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })),
            );
    }

    /**
     * Find a single matching user for a given email
     *
     */
    async findByEmail(email: string): Promise<User> {
        const criteria = { email: email };
        return this.userModel
            .findOne(criteria)
            .exec()
            .catch(err =>
                Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })),
            );
    }

    attachRole(user: User, role: Role): Promise<User> {
        user.role = role.id;
        return user.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    /**
     * Delete one existing user
     *
     */
    delete(user: User): Promise<{ deletedCount?: number }> {
        return this.userModel.deleteOne(user).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    /**
     * Hash user password using default salt
     *
     */
    private hashPassword(user: User): Promise<User> {
        return bcrypt.hash(user.password, SALT_ROUNDS).then(hashedPassword => {
            user.password = hashedPassword;
            return user;
        });
    }

    async findByAnyUniqueId(userDto: UserDto): Promise<User> {
        return this.userModel.findOne({
            $or: [{ username: userDto.username }, { email: userDto.email }, { cin: userDto.cin }],
        });
    }

    private buildPaginateOptions(page: number, limit: number, filterOptions?: FilterOptions): PaginateOptions {
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
        if (!sortBy || !USER_SORTING_FIELDS.includes(sortBy)) {
            return defaultOptions;
        } else {
            return { [sortBy]: sortType ?? 1 };
        }
    }

    private getFilterOptions(): any {
        return {};
    }
}
