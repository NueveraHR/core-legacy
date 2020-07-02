import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { RoleDto } from '@hrms-core/dto/role.dto';
import { Role } from './role.schema';

@Injectable()
export class RoleService {
    constructor(@InjectModel(Role.name) private readonly roleModel: Model<Role>) { }

    async create(roleDto: RoleDto): Promise<Role> {
        let role = new this.roleModel(roleDto);
        return role.save();
    }

    async update(role: Role): Promise<Role> {
        return role.save();
    }

    async delete(role: Role): Promise<Role> {
        return role.deleteOne();
    }

    async findAll(): Promise<Role[]> {
        return await this.roleModel.find().exec();
    }

    async findByRoleName(name: string): Promise<Role> {
        return await this.roleModel.findOne({name: name}).exec();
    }
}