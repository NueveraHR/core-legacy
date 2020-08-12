import { UserDto } from "@hrms-core/dto/user.dto";
import { Injectable, Inject } from "@nestjs/common";
import { UserService } from "@hrms-core/core/user/user.service";
import { LoggerService } from "@libs/logger";
import { ModuleRef } from "@nestjs/core";
import { UserDtoPipe } from "../pipes/user-dto.pipe";
import { ErrorDto, DtoService } from "@hrms-core/common/services/dto/error-dto.service";
import { PaginateResult } from "mongoose";
import { UserDtoValidator } from "../validators/user-dto.validator";
import { RoleService } from "@hrms-core/core/role/role.service";
import { User } from "@hrms-core/core/user/user.schema";

@Injectable()
export class UserFacade {
    constructor(
        private logger: LoggerService,
        private userDtoValidator: UserDtoValidator,
        private userService: UserService,
        private roleService: RoleService,
        private moduleRef: ModuleRef
    ) { }

    @Inject(DtoService) dtoService: DtoService;

    private _userDtoPipe: UserDtoPipe;
    private get userDtoPipe(): UserDtoPipe {
        if (!this._userDtoPipe) {
            this._userDtoPipe = this.moduleRef.get(UserDtoPipe);
        }
        return this._userDtoPipe;
    }

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
        const validationResult = this.userDtoValidator.validate(userDto, { required: ['password'] });

        if (this.dtoService.isError(validationResult)) {
            return Promise.reject(validationResult);
        }

        // check no unique constraints violated
        let findResult: User | ErrorDto;
        await this.userService.findByAnyUniqueId(userDto)
            .then(user => findResult = user)
            .catch(err => findResult = err);

        if (this.dtoService.isError(findResult)) {
            return Promise.reject(findResult);
        } else if (findResult != null) {
            return Promise.reject(this.dtoService.error(42010));
        };

        // try to replace role name by its id
        await this.roleService.findByName(userDto.role)
            .then(role => userDto.role = role.id)
            .catch(err => Promise.reject(this.dtoService.error(42200)));

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
}

export interface UserFilterCriteria {
    page?: number,
    pageSize?: number,

    detailed?: boolean,
    fullyPopulated?: boolean
}

export type UserPaginateDto = PaginateResult<UserDto>;