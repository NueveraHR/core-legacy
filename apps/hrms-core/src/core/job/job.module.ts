import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './job.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
    providers: [JobService],
    exports: [JobService],
})
export class JobModule {}
