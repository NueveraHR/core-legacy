import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Passport } from './passport.schema';
import { PassportDto } from '@hrms-core/dto/passport.dto';

@Injectable()
export class PassportService {
    constructor(@InjectModel(Passport.name) private readonly passportModel: Model<Passport>) {}

    create(passportDto: PassportDto): Promise<Passport> {
        const passport = new this.passportModel(passportDto);
        return passport.save();
    }

    update(id: string, passport: PassportDto): Promise<Passport> {
        return this.passportModel.findByIdAndUpdate(id, passport, { new: true }).exec();
    }

    delete(id: string): Promise<boolean> {
        return this.passportModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
