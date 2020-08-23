import { Test, TestingModule } from '@nestjs/testing';
import { DocumentMangmentService } from './document-mangment.service';

describe('DocumentMangmentService', () => {
  let service: DocumentMangmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentMangmentService],
    }).compile();

    service = module.get<DocumentMangmentService>(DocumentMangmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
