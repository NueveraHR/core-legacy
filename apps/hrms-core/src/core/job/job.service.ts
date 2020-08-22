import { Job } from '@hrms-core/core/job/job.schema';
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobDto } from '@hrms-core/dto/job.dto';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';

@Injectable()
export class JobService {
  @Inject(ErrorService) errorService: ErrorService;

  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
  ) { }

  create(jobDto: JobDto): Promise<Job> {
    const job = new this.jobModel(jobDto);

    return job.save()
      .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
  }

  update(job: Job): Promise<Job> {
    return job.save()
      .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
  }

  delete(id: string): Promise<boolean> {
    return this.jobModel
      .deleteOne({ _id: id })
      .exec()
      .then(result => result.deletedCount == 1)
      .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
  }

  findById(id: string): Promise<Job> {
    return this.jobModel
      .findById(id)
      .exec()
      .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
  }

  find(searchCriteria = {}): Promise<Job[]> {
    return this.jobModel
      .find(searchCriteria)
      .exec()
      .catch(err => Promise.reject(this.errorService.generate(Errors.General.INTERNAL_ERROR, { detailedMessage: err })));
  }

  assertExists(id: string): Promise<boolean> {
    return this.jobModel.findById(id)
      .then(result => {
        if (!result) {
          return Promise.reject(this.errorService.generate(Errors.Job.UNKNOWN_JOB));
        }
        return true;
      });
  }
}
