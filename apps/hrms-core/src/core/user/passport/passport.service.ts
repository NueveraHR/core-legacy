import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Passport } from './passport.schema';
import { PassportDto } from '@hrms-core/dto/passport.dto';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';

@Injectable()
export class PassportService {
    constructor(@InjectModel(Passport.name) private readonly passportModel: Model<Passport>) {}
    @Inject(ErrorService) errorService: ErrorService;

    create(passportDto: PassportDto): Promise<Passport> {
        const passport = new this.passportModel(passportDto);
        return passport.save().catch(err => {
            if (err.code == 11000) {
                // Duplicated key error.
                return Promise.reject(this.errorService.generate(Errors.Passport.DUPLICATE));
            }
            return Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            );
        });
    }

    update(id: string, passport: PassportDto): Promise<Passport> {
        return this.passportModel
            .findByIdAndUpdate(id, passport, { new: true })
            .exec()
            .catch(err => {
                if (err.code == 11000) {
                    // Duplicated key error.
                    return Promise.reject(this.errorService.generate(Errors.Passport.DUPLICATE));
                }
                return Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                );
            });
    }

    delete(id: string): Promise<boolean> {
        return this.passportModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
