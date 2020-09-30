import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Language, LanguageSchema } from './language.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Language.name, schema: LanguageSchema }])],
    providers: [],
})
export class LanguageModule {}
