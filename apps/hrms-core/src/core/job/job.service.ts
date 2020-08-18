import { Job } from '@hrms-core/core/job/job.schema';
import { PaginateModel, PaginateResult } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JobDto } from '@hrms-core/dto/job.dto';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';

@Injectable()
export class JobService {
  @Inject(ErrorService) errorService: ErrorService;

  constructor(
    @InjectModel(Job.name) private readonly jobModel: PaginateModel<Job>,
  ) {}

  create(jobDto: JobDto): Promise<Job> {
    const job = new this.jobModel(jobDto);
    return job.save().catch(err =>
      Promise.reject(
        this.errorService.generate(Errors.General.INTERNAL_ERROR, {
          detailedMessage: err,
        }),
      ),
    );
  }

  update(job: Job): Promise<Job> {
    return job.save().catch(err => {
      if (err.code == 11000) {
        return Promise.reject(this.errorService.generate(44010));
      }
      return Promise.reject(
        this.errorService.generate(Errors.General.INTERNAL_ERROR, {
          detailedMessage: err,
        }),
      );
    });
  }

  delete(id: string): Promise<boolean> {
    return this.jobModel
      .deleteOne({ _id: id })
      .exec()
      .then(result => result.deletedCount == 1)
      .catch(err =>
        Promise.reject(
          this.errorService.generate(Errors.General.INTERNAL_ERROR, {
            detailedMessage: err,
          }),
        ),
      );
  }

  findAll(): Promise<Job[]> {
    return this.jobModel
      .find()
      .exec()
      .catch(err =>
        Promise.reject(
          this.errorService.generate(Errors.General.INTERNAL_ERROR, {
            detailedMessage: err,
          }),
        ),
      );
  }

  findById(id: string): Promise<Job> {
    return this.jobModel
      .findById(id)
      .exec()
      .catch(err =>
        Promise.reject(
          this.errorService.generate(Errors.General.INTERNAL_ERROR, {
            detailedMessage: err,
          }),
        ),
      );
  }

  findAllPaginated(
    page = 1,
    limit = 10,
    filterCriteria = {},
  ): Promise<PaginateResult<Job>> {
    const options = {
      page: page,
      limit: limit,
    };
    return this.jobModel.paginate(filterCriteria, options).catch(err =>
      Promise.reject(
        this.errorService.generate(Errors.General.INTERNAL_ERROR, {
          detailedMessage: err,
        }),
      ),
    );
  }

  findByTitle(title: string): Promise<Job[]> {
    return this.jobModel
      .find({ title: title })
      .exec()
      .catch(err =>
        Promise.reject(
          this.errorService.generate(Errors.General.INTERNAL_ERROR, {
            detailedMessage: err,
          }),
        ),
      );
  }

  findByEmpolyeeId(empId: string): Promise<Job[]> {
    return this.jobModel
      .find({ supervisor: empId })
      .exec()
      .catch(err =>
        Promise.reject(
          this.errorService.generate(Errors.General.INTERNAL_ERROR, {
            detailedMessage: err,
          }),
        ),
      );
  }

  assertExists(id: string): Promise<boolean> {
    return this.jobModel.findById(id).then(result => {
      if (!result) {
        return Promise.reject(
          this.errorService.generate(Errors.Job.UNKNOWN_JOB),
        );
      }
      return true;
    });
  }
}
