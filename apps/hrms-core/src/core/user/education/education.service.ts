import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Education } from './education.schema';
import { EducationDto } from '@hrms-core/dto/user.dto';

@Injectable()
export class EducationService {
    constructor(@InjectModel(Education.name) private readonly educationModel: Model<Education>) {}

    create(educationDto: EducationDto): Promise<Education> {
        const education = new this.educationModel(educationDto);
        return education.save();
    }

    update(education: Education): Promise<Education> {
        return education.save();
    }

    delete(id: string): Promise<boolean> {
        return this.educationModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
