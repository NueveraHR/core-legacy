import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Education, EducationSchema } from './education.schema';
import { EducationService } from './education.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Education.name, schema: EducationSchema }])],
    providers: [EducationService],
    exports: [EducationService],
})
export class EducationModule {}
