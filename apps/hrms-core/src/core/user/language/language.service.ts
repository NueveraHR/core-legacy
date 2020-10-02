import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Language } from './language.schema';
import { LanguageDto } from '@hrms-core/dto/user.dto';

@Injectable()
export class LanguageService {
    constructor(@InjectModel(Language.name) private readonly LanguageModel: Model<Language>) {}

    create(languageDto: LanguageDto): Promise<Language> {
        const language = new this.LanguageModel(languageDto);
        return language.save();
    }

    update(language: Language): Promise<Language> {
        return language.save();
    }

    delete(id: string): Promise<boolean> {
        return this.LanguageModel.deleteOne({ _id: id })
            .exec()
            .then(result => result.deletedCount == 1);
    }
}
