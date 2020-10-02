import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Certification } from './certification.schema';
import { CertificationDto } from '@hrms-core/dto/user.dto';

@Injectable()
export class CertificationService {
    constructor(@InjectModel(Certification.name) private readonly certificationModel: Model<Certification>) {}

    create(certificationDto: CertificationDto): Promise<Certification> {
        const certification = new this.certificationModel(certificationDto);
        return certification.save();
    }

    update(certification: Certification): Promise<Certification> {
        return certification.save();
    }

    delete(id: string): Promise<boolean> {
        return this.certificationModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
