import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Language, LanguageSchema } from './language.schema';
import { LanguageService } from './language.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }])],
    providers: [LanguageService],
    exports: [LanguageService],
})
export class LanguageModule {}
