import { UserDto } from "@hrms-core/dto/user.dto";
import { Injectable, Inject } from "@nestjs/common";
import { UserService } from "@hrms-core/core/user/user.service";
import { LoggerService } from "@libs/logger";
import { ModuleRef } from "@nestjs/core";
import { UserDtoPipe } from "../pipes/user-dto.pipe";
import { DtoService, ErrorDto } from "@hrms-core/common/services/dto/error-dto.service";
import { PaginateResult } from "mongoose";
import { UserDtoValidator } from "../validators/user-dto.validator";
import { RoleService } from "@hrms-core/core/role/role.service";
import { User } from "@hrms-core/core/user/user.schema";
import { UserDtoReversePipe } from "../pipes/user-dto-reverse.pipe";

@Injectable()
export class UserFacade {
    constructor(
        private logger: LoggerService,
        private userDtoValidator: UserDtoValidator,
        private userDtoPipe: UserDtoPipe,
        private userDtoReversePipe: UserDtoReversePipe,
        private userService: UserService,
        private roleService: RoleService,
        private moduleRef: ModuleRef
    ) { }

    @Inject(DtoService) dtoService: DtoService;

    userList(filterCriteria?: UserFilterCriteria): Promise<UserPaginateDto> {
        return this.userService
            .findAllPaginated(filterCriteria?.page, filterCriteria?.pageSize)
            .then(result => {
                const userPaginateDto: UserPaginateDto = {
                    total: result.total,
                    pages: result.pages,
                    page: result.page,
                    limit: result.limit,
                    offset: result.offset,
                    docs: result.docs.map(
                        user => this.userDtoPipe.transform(user, { detailed: filterCriteria?.detailed })
                    ),
                };
                return userPaginateDto;
            })
    }

    async createUser(userDto: UserDto): Promise<UserDto> {
        const validationResult = this.userDtoValidator.validate(userDto, { required: ['password', 'role'] });

        if (this.dtoService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // assert role existence
        await this.roleService.findById(userDto.role)
            .catch(() => Promise.reject(this.dtoService.error(42201)));

        return this.userService.create(userDto).then(user =>
            this.userDtoPipe.transform(user)
        );
    }

    userDetails(id: string): Promise<UserDto> {
        return this.userService.findById(id)
            .then(user => {
                if (user)
                    return this.userDtoPipe.transform(user, { detailed: true });
                else
                    return Promise.reject(this.dtoService.error(42002));
            });
    }

    async updateUser(id: string, userDto: UserDto): Promise<UserDto> {
        const validationResult = this.userDtoValidator.validate(userDto);
        if (this.dtoService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // retrieve current registered role record.
        let result: User | ErrorDto;
        await this.userService
            .findById(id)
            .then(user => result = user)
            .catch(err => result = err);

        // Check for retrieval error
        if (this.dtoService.isError(result))
            return Promise.reject(result);
        else if (!result)
            return Promise.reject(this.dtoService.error(42003));

        const userToUpdate = this.userDtoReversePipe.transformExistent(userDto, result as User);
        return this.userService.update(userToUpdate)
            .then(user => this.userDtoPipe.transform(user, { detailed: true }))
    }
}

export interface UserFilterCriteria {
    page?: number,
    pageSize?: number,

    detailed?: boolean,
    fullyPopulated?: boolean
}

export type UserPaginateDto = PaginateResult<UserDto>;