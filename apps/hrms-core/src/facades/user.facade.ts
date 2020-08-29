import { UserDto } from '@hrms-core/dto/user.dto';
import { Inject } from '@nestjs/common';
import { UserService } from '@hrms-core/core/user/user.service';
import { LoggerService } from '@libs/logger';
import { UserDtoPipe } from '../core/user/pipes/user-dto.pipe';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { PaginateResult } from 'mongoose';
import { UserDtoValidator } from '../core/user/validators/user-dto.validator';
import { RoleService } from '@hrms-core/core/role/role.service';
import { UserDtoReversePipe } from '../core/user/pipes/user-dto-reverse.pipe';
import { Errors } from '@hrms-core/common/error/error.const';

export class UserFacade {
    constructor(
        protected logger: LoggerService,
        protected userDtoValidator: UserDtoValidator,
        protected userDtoPipe: UserDtoPipe,
        protected userDtoReversePipe: UserDtoReversePipe,
        protected userService: UserService,
        protected roleService: RoleService,
    ) {}

    @Inject(ErrorService) errorService: ErrorService;

    list(paginationOptions?: PaginationOptions, filterCriteria = {}): Promise<UserPaginateDto | UserDto[]> {
        if (!paginationOptions) {
            return this.userService.findAll().then(users =>
                users.map(user =>
                    this.userDtoPipe.transform(user, {
                        detailed: paginationOptions?.detailed,
                    }),
                ),
            );
        } else {
            return this.userService
                .findAllPaginated(paginationOptions?.page, paginationOptions?.pageSize, filterCriteria)
                .then(result => {
                    const userPaginateDto: UserPaginateDto = {
                        total: result.total,
                        pages: result.pages,
                        page: result.page,
                        limit: result.limit,
                        offset: result.offset,
                        docs: result.docs.map(user =>
                            this.userDtoPipe.transform(user, {
                                detailed: paginationOptions?.detailed,
                            }),
                        ),
                    };
                    return userPaginateDto;
                });
        }
    }

    create(userDto: UserDto): Promise<any> {
        const validationResult = this.userDtoValidator.validate(userDto, {
            required: ['password', 'role'],
        });

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // assert role existence
        return this.roleService
            .assertExists(userDto.role as string)
            .then(() => this.userService.create(userDto).then(user => this.userDtoPipe.transform(user)));
    }

    details(id: string): Promise<UserDto> {
        return this.userService.findById(id).then(user => {
            if (user) return this.userDtoPipe.transform(user, { detailed: true });
            else return Promise.reject(this.errorService.generate(Errors.User.DETAILS_INVALID_REQUEST));
        });
    }

    async update(id: string, userDto: UserDto, basicInfoOnly = false): Promise<UserDto> {
        userDto.id = id;
        const validationResult = this.userDtoValidator.validate(userDto, {
            required: ['id'],
            others: { basic: basicInfoOnly },
        });
        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        if (!basicInfoOnly) {
            await this.roleService.assertExists(userDto.role as string);
        }

        return this.userService.findById(id).then(user => {
            if (!user) {
                return Promise.reject(this.errorService.generate(Errors.User.UPDATE_UNKNOWN_ID));
            }
            const userToUpdate = this.userDtoReversePipe.transformExistent(userDto, user);
            return this.userService
                .update(userToUpdate)
                .then(user => this.userDtoPipe.transform(user, { detailed: true }));
        });
    }
}

export interface PaginationOptions {
    page?: number;
    pageSize?: number;

    detailed?: boolean;
    fullyPopulated?: boolean;
}

export type UserPaginateDto = PaginateResult<UserDto>;
