import { Test, TestingModule } from '@nestjs/testing';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { AddressService } from './address.service';
import { LoggerService } from '@libs/logger';
import { ADDRESS_MOCK } from '@hrms-core/test/mock/address-mock';

describe('Address Service', () => {
    let dbManager: DBManager;
    let addressService: AddressService;
    let loggerService: LoggerService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        addressService = moduleRef.get<AddressService>(AddressService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create Address', () => {
        it('should create address successfully ', async () => {
            expect.assertions(6);
            const address = await addressService.create(ADDRESS_MOCK.basic);

            expect(address).toBeTruthy();
            expect(address).toHaveProperty('addressLine1');
            expect(address).toHaveProperty('city');
            expect(address).toHaveProperty('state');
            expect(address).toHaveProperty('country');
            expect(address).toHaveProperty('postalCode');
        });
    });

    describe('Update Address', () => {
        it('should update job successfully', async () => {});
    });
});
