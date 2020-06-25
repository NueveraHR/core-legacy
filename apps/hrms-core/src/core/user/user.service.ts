import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { userDTO } from "@hrms-core/common/dto/user.dto";
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {


    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async create(userDTO: userDTO): Promise<User> {
        let user = new this.userModel(userDTO);
        await this.hashPassword(user).then(updatedUser => user = updatedUser);

        return user.save();
    }

    async update(user: User): Promise<User> {
        if (user.isModified('password')) {
            await this.hashPassword(user).then(updatedUser => user = updatedUser);
        }

        return user.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByUsername(username: string): Promise<User> {
        const criteria = { username: username };
        return this.userModel.findOne(criteria).exec();
    }

    async findByEmail(email: string): Promise<User> {
        const criteria = { email: email };
        return this.userModel.findOne(criteria).exec();
    }

    private async hashPassword(user: User): Promise<User> {
        return bcrypt.hash(user.password, SALT_ROUNDS).then(hashedPassword => {
            user.password = hashedPassword;
            return user;
        })
    }

}