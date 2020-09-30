import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Education, EducationSchema } from './education.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Education.name, schema: EducationSchema }])],
    providers: [],
})
export class EducationModule {}
