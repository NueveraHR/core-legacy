import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { LANGUAGE } from '@hrms-core/test/mock/language.mock';
import { LoggerService } from '@libs/logger';
import { Test } from '@nestjs/testing';
import { LanguageService } from './language.service';

describe('Language Service', () => {
    let dbManager: DBManager;
    let loggerService: LoggerService;
    let languageService: LanguageService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
        languageService = moduleRef.get<LanguageService>(LanguageService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create language', () => {
        it('should create', () => {
            expect(languageService.create(LANGUAGE.en)).resolves.toEqual(
                expect.objectContaining({ name: LANGUAGE.en.name }),
            );
        });
    });

    describe('Update language', () => {
        it('should update', async () => {
            const lang = await languageService.create(LANGUAGE.en);
            expect(lang.name).toEqual(LANGUAGE.en.name);
            lang.name = 'French';
            expect(languageService.update(lang)).resolves.toEqual(expect.objectContaining({ name: 'French' }));
        });
    });

    describe('Delete language', () => {
        it('should delete ', async () => {
            const lang = await languageService.create(LANGUAGE.en);
            expect(languageService.delete(lang.id)).resolves.toBeTruthy();
        });
    });
});
