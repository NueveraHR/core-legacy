import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { userDTO } from "./user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async create(userDTO: userDTO): Promise<User> {
        const user = new this.userModel(userDTO);
        return user.save();        
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

}