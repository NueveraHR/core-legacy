import { SkillDto } from '@hrms-core/dto/skill.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skill } from './skill.schema';

@Injectable()
export class SkillService {
    constructor(@InjectModel(Skill.name) private readonly skillModel: Model<Skill>) {}

    create(skillDto: SkillDto): Promise<Skill> {
        const education = new this.skillModel(skillDto);
        return education.save();
    }

    update(skill: Skill): Promise<Skill> {
        return skill.save();
    }

    delete(id: string): Promise<boolean> {
        return this.skillModel
            .deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
