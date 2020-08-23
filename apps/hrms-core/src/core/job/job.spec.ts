import { Test } from '@nestjs/testing';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { LoggerService } from '@libs/logger';
import { JobService } from './job.service';
import { JOBS } from '@hrms-core/test/mock/job-mock';

describe('Job Service', () => {
    let dbManager: DBManager;
    let jobService: JobService;
    let loggerService: LoggerService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        jobService = moduleRef.get<JobService>(JobService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create Job', () => {
        it('should create Job successfully', async () => {
            expect.assertions(10);
            const job = await jobService.create(JOBS.createJob);
            expect(job).not.toBeUndefined();
            expect(job).not.toBeNull();
            expect(job).toHaveProperty('id');
            expect(job).toHaveProperty('title');
            expect(job).toHaveProperty('startDate');
            expect(job).toHaveProperty('location');
            expect(job).toHaveProperty('department');
            expect(job).toHaveProperty('salary');
            expect(job).toHaveProperty('salaryFrequency');
            expect(job).toHaveProperty('salaryCurrency');
        });
    });

    describe('Find job', () => {
        it('should find job by id', async () => {
            const job = await jobService.create(JOBS.createJob);
            const foundJob = await jobService.findById(job.id);
            expect(foundJob).not.toBeUndefined();
            expect(foundJob?.id).toEqual(job.id);
        });
    });

    describe('Update Job', () => {
        it('should update job successfully', async () => {
            expect.assertions(7);

            let job = await jobService.create(JOBS.createJob);
            expect(job).not.toBeUndefined();
            expect(job).not.toBeNull();

            job.title = 'title updated';
            job.salary = 1234;

            job = await jobService.update(job);

            expect(job).toHaveProperty('title');
            expect(job).toHaveProperty('startDate');
            expect(job).toHaveProperty('salary');

            expect(job.title).toBe('title updated');
            expect(job.salary).toBe(1234);
        });
    });

    describe('Delete Job', () => {
        it('should remove job successfully', async () => {
            expect.assertions(1);

            const job = await jobService.create(JOBS.createJob);
            await expect(jobService.delete(job.id)).resolves.toEqual(true);
        });
    });
});
