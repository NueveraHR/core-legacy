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
import { AddressService } from '@hrms-core/core/address/address.service';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { PaginationOptions, NvrPaginateResult, FilterOptions } from '@hrms-core/common/interfaces/pagination';
import { Address } from '@hrms-core/core/address/address.schema';

export class UserFacade {
    constructor(
        protected logger: LoggerService,
        protected userDtoValidator: UserDtoValidator,
        protected userDtoPipe: UserDtoPipe,
        protected userDtoReversePipe: UserDtoReversePipe,
        protected userService: UserService,
        protected roleService: RoleService,
        protected addressService: AddressService,
    ) {}

    @Inject(ErrorService) errorService: ErrorService;

    list(paginationOptions: PaginationOptions, filterOptions?: FilterOptions): Promise<UserPaginateDto> {
        return this.userService
            .findAllPaginated(paginationOptions.page, paginationOptions.limit, filterOptions)
            .then(result => {
                const userPaginateDto: UserPaginateDto = {
                    total: result.total as number,
                    pages: result.pages as number,
                    page: result.page,
                    limit: result.limit,
                    nextPage: result.nextPage,
                    prevPage: result.prevPage,
                    docs: result.docs.map(user => this.userDtoPipe.transform(user)),
                };
                return userPaginateDto;
            });
    }

    async create(userDto: UserDto): Promise<any> {
        const validationResult = this.userDtoValidator.validate(userDto, {
            required: ['password', 'role'],
        });

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // assert role existence
        await this.roleService.assertExists(userDto.role as string);

        if (userDto.address) {
            // create corresponding address and reassign its id to user
            userDto.address = (await this.addressService.create(userDto.address as AddressDto)).id;
        }

        // populate missing user props with default values
        userDto = this.populateMissingValues(userDto);

        return this.userService.create(userDto).then(user => this.userDtoPipe.transform(user));
    }

    details(id: string): Promise<UserDto> {
        return this.userService.findById(id).then(user => {
            if (user) return this.userDtoPipe.transform(user);
            else return Promise.reject(this.errorService.generate(Errors.User.DETAILS_INVALID_REQUEST));
        });
    }

    async update(userDto: UserDto, basicInfoOnly = false): Promise<UserDto> {
        const validationResult = this.userDtoValidator.validate(userDto);

        if (this.errorService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        const user = await this.userService.findById(userDto.id);
        if (!user) {
            return Promise.reject(this.errorService.generate(Errors.User.UPDATE_UNKNOWN_ID));
        }

        this.userDtoReversePipe.transformExistent(userDto, user);
        await this.addressService.update(user.address as Address);
        return this.userService.update(user).then(user => this.userDtoPipe.transform(user));
    }

    private populateMissingValues(userDto: UserDto): UserDto {
        if (!userDto.username) {
            userDto.username = userDto.email.substring(0, userDto.email.lastIndexOf('@'));
        }

        if (!userDto.prefix) {
            const gender = userDto.gender.toUpperCase();
            let prefix: string;

            switch (gender) {
                case 'MALE':
                    prefix = 'Mr.';
                    break;
                case 'FEMALE':
                    prefix = 'Mrs.';
                    break;
                default:
                    prefix = 'Mx.';
            }
            userDto.prefix = prefix;
        }

        return userDto;
    }
}

export type UserPaginateDto = NvrPaginateResult<UserDto>;
