import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { PaginateModel, PaginateResult, PaginateOptions, FilterQuery } from 'mongoose';
import { UserDto } from '@hrms-core/user/user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../role/role.schema';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { Skill } from './skill/skill.schema';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        @InjectModel(User.name) private readonly userModel: PaginateModel<User>,
    ) {}

    /**
     * Create user model based on a userDTO
     *
     */
    async create(userDTO: UserDto): Promise<User> {
        let user = new this.userModel(userDTO);

        // password optional on creation
        if (user.password) {
            await this.hashPassword(user).then(updatedUser => (user = updatedUser));
        }

        return user.save().catch(err => {
            if (err.code == 11000) {
                // Duplicated key error.
                return Promise.reject(
                    this.errorService.generate(Errors.User.CREATE_DUPLICATED),
                );
            }
            return Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            );
        });
    }

    /**
     * Update existing user model
     *
     */
    async update(user: User): Promise<User> {
        if (user.isModified('password')) {
            await this.hashPassword(user).then(updatedUser => (user = updatedUser));
        }

        return user.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    /**
     * Find all users in DB without applying any filters
     *
     */
    async findAll(options?: { populate?: string[] }): Promise<User[]> {
        let resp: Promise<User[]>;

        if (!options?.populate?.length) {
            resp = this.userModel.find().exec();
        } else {
            resp = this.userModel
                .find()
                .populate(options.populate.join(' '))
                .exec();
        }

        return resp.catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    async findByQuery(
        query: FilterQuery<User>,
        options?: PaginateOptions,
    ): Promise<PaginateResult<User>> {
        return this.userModel.paginate(query, options).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    /**
     * Find a single matching user for given id
     *
     */
    findById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    /**
     * Find a single matching user for a given username
     *
     */
    async findByUsername(username: string): Promise<User> {
        const criteria = { username: username };
        return this.userModel
            .findOne(criteria)
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    /**
     * Find a single matching user for a given email
     *
     */
    async findByEmail(email: string): Promise<User> {
        const criteria = { email: email };
        return this.userModel
            .findOne(criteria)
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    async findByAnyUniqueId(userDto: UserDto): Promise<User> {
        return this.userModel.findOne({
            $or: [
                { username: userDto.username },
                { email: userDto.email },
                { cin: userDto.cin },
            ],
        });
    }

    /**
     * Delete one existing user
     *
     */
    async delete(user: User): Promise<{ deletedCount?: number }> {
        return this.userModel.deleteOne(user).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    async updatePicture(id: string, imagePath: string): Promise<User> {
        const user: User = await this.findById(id);
        user.picture = imagePath;
        return this.update(user);
    }

    async attachRole(user: User, role: Role): Promise<User> {
        user.role = role.id;
        return user.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    attachSkill(userId: string, skillId: string): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(userId, { $push: { skills: skillId } }, { new: true })
            .exec();
    }

    setSkills(userId: string, skillsId: string[]): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(userId, { skills: skillsId }, { new: true })
            .exec();
    }

    async getSkills(userId: string): Promise<Skill[]> {
        return (
            await this.userModel
                .findById(userId)
                .select('skills')
                .exec()
        ).skills as Skill[];
    }

    attachEducation(userId: string, educationId: string): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(
                userId,
                { $push: { educationHistory: educationId } },
                { new: true },
            )
            .exec();
    }

    detachEducation(educationId: string): Promise<User> {
        return this.userModel
            .findOneAndUpdate(
                { educationHistory: { $elemMatch: { $eq: educationId } } },
                { $pull: { educationHistory: educationId } },
                { new: true },
            )
            .exec();
    }

    attachCertification(userId: string, certificationId: string): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(
                userId,
                { $push: { certifications: certificationId } },
                { new: true },
            )
            .exec();
    }

    detachCertification(certificationId: string): Promise<User> {
        return this.userModel
            .findOneAndUpdate(
                { certifications: { $elemMatch: { $eq: certificationId } } },
                { $pull: { certifications: certificationId } },
                { new: true },
            )
            .exec();
    }

    attachLanguage(userId: string, languageId: string): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(
                userId,
                { $push: { languages: languageId } },
                { new: true },
            )
            .exec();
    }

    detachLanguage(languageId: string): Promise<User> {
        return this.userModel
            .findOneAndUpdate(
                { languages: { $elemMatch: { $eq: languageId } } },
                { $pull: { languages: languageId } },
                { new: true },
            )
            .exec();
    }

    setPassport(userId: string, passportId: string): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(userId, { passport: passportId }, { new: true })
            .exec();
    }

    attachJob(employeeId: string, jobId: string): Promise<User> {
        return this.userModel
            .findByIdAndUpdate(employeeId, { $push: { jobHistory: jobId } })
            .exec();
    }

    detachJob(jobId: string): Promise<User> {
        return this.userModel
            .findOneAndUpdate(
                { jobHistory: { $elemMatch: { $eq: jobId } } },
                { $pull: { jobHistory: jobId } },
                { new: true },
            )
            .exec();
    }
    // ------------------------------------------------------------------------
    // @ Privates
    // ------------------------------------------------------------------------

    private hashPassword(user: User): Promise<User> {
        return bcrypt.hash(user.password, SALT_ROUNDS).then(hashedPassword => {
            user.password = hashedPassword;
            return user;
        });
    }
}
