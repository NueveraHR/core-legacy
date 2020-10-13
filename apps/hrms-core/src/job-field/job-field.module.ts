import { JobFieldService } from './job-field.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobField, JobFieldSchema } from './job-field.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: JobField.name, schema: JobFieldSchema }])],
    providers: [JobFieldService],
    exports: [JobFieldService],
})
export class JobFieldModule {}
