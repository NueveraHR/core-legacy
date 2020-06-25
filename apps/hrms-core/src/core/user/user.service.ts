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
        const user = new this.userModel(userDTO);
        await UserService.hashPassword(user.password).then(hashedPassword => {
            user.password = hashedPassword;
        });

        return user.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByUsername(username: string): Promise<User> {
        const criteria = { username: username };
        return this.userModel.findOne(criteria).exec();
    }

    static async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    }
}