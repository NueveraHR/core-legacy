import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { LoggerService } from '@libs/logger';
import { Test } from '@nestjs/testing';
import { SkillModule } from './skill.module';
import { SkillService } from './skill.service';

describe('Skill Test suite', () => {
    let dbManager: DBManager;
    let skillService: SkillService;
    let loggerService: LoggerService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        skillService = moduleRef.get<SkillService>(SkillService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });
    it('should be defined', () => {
        expect(skillService).toBeDefined();
    });
});
