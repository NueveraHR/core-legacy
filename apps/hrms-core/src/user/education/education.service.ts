import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Education } from './education.schema';
import { EducationDto } from '@hrms-core/user/user.dto';

@Injectable()
export class EducationService {
    constructor(@InjectModel(Education.name) private readonly educationModel: Model<Education>) {}

    create(educationDto: EducationDto): Promise<Education> {
        const education = new this.educationModel(educationDto);
        return education.save();
    }

    update(id: string, educationDto: EducationDto): Promise<Education> {
        return this.educationModel.findByIdAndUpdate(id, educationDto, { new: true }).exec();
    }

    delete(id: string): Promise<boolean> {
        return this.educationModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
