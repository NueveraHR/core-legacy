import { Test, TestingModule } from '@nestjs/testing';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';

describe('Department Service', () => {
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HRMSCoreModule],
        }).compile();

        // service = module.get<DocumentMangmentService>(DocumentMangmentService);
    });

    it('should be defined', () => {
        expect(true).toBeTruthy();
    });
});
