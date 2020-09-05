import { PaginateModel, PaginateResult } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RoleDto } from '@hrms-core/dto/role.dto';
import { Role } from './role.schema';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
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

    findAllPaginated(page = 1, limit = 10): Promise<PaginateResult<Role>> {
        const options = {
            page: page,
            limit: limit,
            customLabels: {
                totalDocs: 'total',
                totalPages: 'pages',
            },
        };
        return this.roleModel.paginate({}, options).catch(err =>
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
}
