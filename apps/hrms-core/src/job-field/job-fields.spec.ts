import { Test } from '@nestjs/testing';
import { JobFieldService } from './job-field.service';

describe('JobField Test suite', () => {
    let jobFieldService: JobFieldService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [JobFieldService],
        }).compile();

        jobFieldService = module.get<JobFieldService>(JobFieldService);
    });

    it('should be defined', () => {
        expect(jobFieldService).toBeDefined();
    });
});
