import { PaginateModel, PaginateResult } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RoleDto } from '@hrms-core/dto/role.dto';
import { Role } from './role.schema';

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role.name) private readonly roleModel: PaginateModel<Role>) { }

    async create(roleDto: RoleDto): Promise<Role> {
        let role = new this.roleModel(roleDto);
        return role.save();
    }

    async update(role: Role): Promise<Role> {
        return role.save();
    }

    async delete(role: Role): Promise<{ deletedCount?: number }> {
        return this.roleModel.deleteOne(role);
    }

    async findAll(): Promise<Role[]> {
        return await this.roleModel.find().exec();
    }

    async findAllPaginated(page: number = 1, limit: number = 10): Promise<PaginateResult<Role>> {
        const options = {
            page: page,
            limit: limit,
        };
        return this.roleModel.paginate({}, options);
    }

    async findByRoleName(name: string): Promise<Role> {
        return await this.roleModel.findOne({ name: name }).exec();
    }

    async findById(id: string): Promise<Role> {
        return await this.roleModel.findById(id).exec();
    }
}