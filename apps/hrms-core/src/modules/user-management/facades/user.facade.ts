import { UserDTO } from "@hrms-core/dto/user.dto";
import { User } from "@hrms-core/core/user/user.schema";
import { Injectable } from "@nestjs/common";
import { UserService } from "@hrms-core/core/user/user.service";
import { LoggerService } from "@libs/logger";
import { ModuleRef } from "@nestjs/core";
import { UserDtoPipe } from "../pipes/user-dto.pipe";
import { ErrorDto } from "@hrms-core/dto/error.dto";
import { PaginateResult } from "mongoose";

@Injectable()
export class UserFacade {
    constructor(
        private logger: LoggerService,
        private userService: UserService,
        private moduleRef: ModuleRef
    ) { }


    private _userDtoPipe: UserDtoPipe;
    private get userDtoPipe(): UserDtoPipe {
        if (!this._userDtoPipe) {
            this._userDtoPipe = this.moduleRef.get(UserDtoPipe);
        }
        return this._userDtoPipe;
    }

    async userList(filterCriteria?: UserFilterCriteria): Promise<UserPaginateDto | ErrorDto> {
        return this.userService
            .findAllPaginated(filterCriteria?.page, filterCriteria?.pageSize)
            .then(result => {
                let userPaginateDto: UserPaginateDto;
                userPaginateDto.total = result.total;
                userPaginateDto.pages = result.pages;
                userPaginateDto.page = result.page;
                userPaginateDto.limit = result.limit;
                userPaginateDto.offset = result.offset;
                userPaginateDto.docs = result.docs.map(
                    user => this.userDtoPipe.transform(user, { detailed: filterCriteria?.detailed })
                );
                return userPaginateDto;
            }).catch(err => new ErrorDto(err.message))
    }
}

export interface UserFilterCriteria {
    page?: number,
    pageSize?: number,

    detailed?: boolean,
    fullyPopulated?: boolean
}

export type UserPaginateDto = PaginateResult<UserDTO>;