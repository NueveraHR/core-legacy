import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { userDTO } from "@hrms-core/dto/user.dto";
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {


    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    /**
     * Create user model based on a userDTO
     *
     */
    async create(userDTO: userDTO): Promise<User> {
        let user = new this.userModel(userDTO);
        await this.hashPassword(user).then(updatedUser => user = updatedUser);

        return user.save();
    }

    /**
     * Update existing user model
     *
     */
    async update(user: User): Promise<User> {
        if (user.isModified('password')) {
            await this.hashPassword(user).then(updatedUser => user = updatedUser);
        }

        return user.save();
    }

    /**
     * Find all users in DB without applying any filters
     *
     */
    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    /**
     * Find a single matching user for a given username
     *
     */
    async findByUsername(username: string): Promise<User> {
        const criteria = { username: username };
        return this.userModel.findOne(criteria).exec();
    }

    /**
     * Find a single matching user for a given email
     *
     */
    async findByEmail(email: string): Promise<User> {
        const criteria = { email: email };
        return this.userModel.findOne(criteria).exec();
    }

    /**
     * Hash user password using default salt
     *
     */
    private async hashPassword(user: User): Promise<User> {
        return bcrypt.hash(user.password, SALT_ROUNDS).then(hashedPassword => {
            user.password = hashedPassword;
            return user;
        })
    }

}