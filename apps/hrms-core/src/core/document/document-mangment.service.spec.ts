import { Test, TestingModule } from '@nestjs/testing';
import { DocumentMangmentService } from './document-mangment.service';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';

describe('DocumentMangmentService', () => {
    let service: DocumentMangmentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HRMSCoreModule],
        }).compile();

        service = module.get<DocumentMangmentService>(DocumentMangmentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
