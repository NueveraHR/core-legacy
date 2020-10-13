import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { CERTIFICATION } from '@hrms-core/test/mock/certification.mock';
import { LoggerService } from '@libs/logger';
import { Test } from '@nestjs/testing';
import { CertificationService } from './certification.service';

describe('Certification Service', () => {
    let dbManager: DBManager;
    let loggerService: LoggerService;
    let certificationService: CertificationService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
        certificationService = moduleRef.get<CertificationService>(CertificationService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create certification', () => {
        it('should create', () => {
            expect(certificationService.create(CERTIFICATION.full)).resolves.toEqual(
                expect.objectContaining({ name: CERTIFICATION.full.name }),
            );
        });
    });

    describe('Update certification', () => {
        it('should update', async () => {
            const cert = await certificationService.create(CERTIFICATION.full);
            expect(cert.name).toEqual(CERTIFICATION.full.name);

            const newCert = { ...CERTIFICATION.full, name: 'new Name' };
            expect(certificationService.update(cert.id, newCert)).resolves.toEqual(
                expect.objectContaining({ name: 'new Name' }),
            );
        });
    });

    describe('Delete certification', () => {
        it('should delete ', async () => {
            const cert = await certificationService.create(CERTIFICATION.full);
            expect(certificationService.delete(cert.id)).resolves.toBeTruthy();
        });
    });
});
