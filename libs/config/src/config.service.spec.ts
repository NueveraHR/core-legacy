import { Test, TestingModule } from '@nestjs/testing';
import { HRMSConfigService } from './config.service';
import { EnvModule } from '@libs/env';

describe('ConfigService', () => {
  let service: HRMSConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvModule],
      providers: [HRMSConfigService],
    }).compile();

    service = module.get<HRMSConfigService>(HRMSConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
