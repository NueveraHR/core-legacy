import { PaginateModel, PaginateResult } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RoleDto } from '@hrms-core/dto/role.dto';
import { Role } from './role.schema';
import { DtoService } from '@hrms-core/common/services/dto/error-dto.service';

@Injectable()
export class RoleService {
    @Inject(DtoService) dtoService: DtoService;

    constructor(@InjectModel(Role.name) private readonly roleModel: PaginateModel<Role>) { }

    async create(roleDto: RoleDto): Promise<Role> {
        let role = new this.roleModel(roleDto);
        return role.save()
        .catch(err => Promise.reject(this.dtoService.error(50000)));
    }

    async update(role: Role): Promise<Role> {
        return role
            .save()
            .catch(err => Promise.reject(this.dtoService.error(50000)));

    }

    async delete(role: Role): Promise<boolean> {
        const result = await this.roleModel
            .deleteOne(role)
            .exec()
            .catch(err => Promise.reject(this.dtoService.error(50000)));

        return (result.deletedCount == 1);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleModel
            .find()
            .exec()
            .catch(err => Promise.reject(this.dtoService.error(50000)));

    }

    async findAllPaginated(page: number = 1, limit: number = 10): Promise<PaginateResult<Role>> {
        const options = {
            page: page,
            limit: limit,
        };
        return this.roleModel
            .paginate({}, options)
            .catch(err => Promise.reject(this.dtoService.error(50000)));
        }

    async findByName(name: string): Promise<Role> {
        return this.roleModel
            .findOne({ name: name })
            .exec()
            .catch(err => Promise.reject(this.dtoService.error(50000)));
        }

    async findById(id: string): Promise<Role> {
        return this.roleModel
            .findById(id)
            .exec()
            .catch(err => Promise.reject(this.dtoService.error(50000)));
        }
}