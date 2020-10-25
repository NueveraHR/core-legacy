import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Certification } from './certification.schema';
import { CertificationDto } from '@hrms-core/user/user.dto';

@Injectable()
export class CertificationService {
    constructor(
        @InjectModel(Certification.name)
        private readonly certificationModel: Model<Certification>,
    ) {}

    findById(id: string): Promise<CertificationDto> {
        return this.certificationModel.findById(id).exec();
    }

    create(certificationDto: CertificationDto): Promise<Certification> {
        const certification = new this.certificationModel(certificationDto);
        return certification.save();
    }

    update(id: string, cert: CertificationDto): Promise<Certification> {
        return this.certificationModel
            .findByIdAndUpdate(id, cert as Certification, { new: true })
            .exec();
    }

    delete(id: string): Promise<boolean> {
        return this.certificationModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
