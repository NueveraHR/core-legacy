import { Test } from '@nestjs/testing';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { PrivilegeService } from './privilege.service';
import { assert } from 'console';

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
        expect.assertions(1);

        it('should throw "ENOENT" for wrong filename', () => {
            try {
                privilegeService.loadConfig('wrong_path.json');
                fail('Didn\'t throw for wrong filename');
            } catch (e) {
                expect(e.code).toEqual('ENOENT');
            }
        });

        it('should load with default filename', () => {
            expect.assertions(3);

            const config = privilegeService.loadConfig()
            expect(config).not.toBeUndefined();
            expect(config).not.toBeNull();
            expect(Object.keys(config).length).toBeGreaterThan(1);
        });

        it('should load with specified filename', () => {
            expect.assertions(3);

            const config = privilegeService.loadConfig('privilege.json')
            expect(config).not.toBeUndefined();
            expect(config).not.toBeNull();
            expect(Object.keys(config).length).toBeGreaterThan(1);
        });
    });

    describe('Parse privileges correctly', () => {
        it("should find requests page action privileges", () => {
            expect.assertions(2);
            const privileges = privilegeService.privileges;
            expect(privileges).not.toBeNull();
            expect(privileges).toHaveProperty('shared.requests.approve');
        })
    })

})