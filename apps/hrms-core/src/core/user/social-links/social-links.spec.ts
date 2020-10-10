import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { SOCIAL_LINKS } from '@hrms-core/test/mock/social-links.mock';
import { LoggerService } from '@libs/logger';
import { Test } from '@nestjs/testing';
import { SocialLinkService } from './social-links.service';

describe('SocialLink Test suite', () => {
    let dbManager: DBManager;
    let socialLinkService: SocialLinkService;
    let loggerService: LoggerService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        socialLinkService = moduleRef.get<SocialLinkService>(SocialLinkService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    it('should be defined', () => {
        expect(socialLinkService).toBeDefined();
    });

    describe('Create social links', () => {
        it('Create successfully', async () => {
            const model = await socialLinkService.create(SOCIAL_LINKS.complete);
            expect(model).toBeDefined();
            expect(model.id).toBeDefined();
            expect(model.linkedIn).toBeTruthy();
            expect(model.whatsApp).toBeTruthy();
            expect(model.facebook).toBeTruthy();
            expect(model.github).toBeTruthy();
            expect(model.stackOverflow).toBeTruthy();
        });
    });

    describe('Update social links', () => {
        it('Update successfully', async () => {
            const model = await socialLinkService.create(SOCIAL_LINKS.complete);
            model.linkedIn = '';
            expect(socialLinkService.update(model)).resolves.toEqual(expect.objectContaining({ linkedIn: '' }));
        });
    });
});
