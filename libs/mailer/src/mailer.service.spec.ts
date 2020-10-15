import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';

describe('MailerService', () => {
    let service: MailerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EnvModule, LoggerModule],
            providers: [MailerService],
        }).compile();

        service = module.get<MailerService>(MailerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
