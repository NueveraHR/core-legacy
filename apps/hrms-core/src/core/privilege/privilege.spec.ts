import { Test } from '@nestjs/testing';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { PrivilegeService } from './privilege.service';

describe('Privilege Service', () => {
    let privilegeService: PrivilegeService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
        }).compile();


        beforeEach(() => {
            privilegeService = moduleRef.get<PrivilegeService>(PrivilegeService);
        })
    });

    describe('Load privileges correctly', () => {

        it('should throw "ENOENT" for wrong filename', async () => {
            try {
                privilegeService.loadConfig('wrong_path.json');
                fail('Didn\'t throw for wrong filename');
            } catch (e) {
                expect(e.code).toEqual('ENOENT');
            }
        });

        it('should load with default filename', async () => {
            const config = privilegeService.loadConfig()
            expect(config).not.toBeUndefined();
            expect(config).not.toBeNull();
            expect(Object.keys(config).length).toBeGreaterThan(1);
        });

        it('should load with specified filename', async () => {
            const config = privilegeService.loadConfig('privilege.json')
            expect(config).not.toBeUndefined();
            expect(config).not.toBeNull();
            expect(Object.keys(config).length).toBeGreaterThan(1);
        });
    });

    describe('Parse privileges correctly', () => {

        it('should fail if not explicity loaded config', () => {
            expect(() => privilegeService.getPortalPrivileges('user-management'))
                .toThrowError('Unknown config, Did you forget to call loadConfig() ?');
        });

        it('should throw for wrong given portal', () => {
            privilegeService.loadConfig();
            expect(() => privilegeService.getPortalPrivileges('inexistent-portal'))
                .toThrowError('Unknown portal with given name: inexistent-portal')

        });

        it('should return privileges for given portal', () => {
            privilegeService.loadConfig();
            const privileges = privilegeService.getPortalPrivileges('user-management');
            expect(privileges).not.toBeUndefined();
            expect(privileges).not.toBeNull();
            expect(privileges.actions.length).toBeGreaterThan(1);
            expect(privileges.pages.length).toBeGreaterThan(1);
        });
    })

})