import { Test } from '@nestjs/testing';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { RoleService } from '@hrms-core/core/role/role.service';
import { LoggerService } from '@libs/logger';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { UserService } from '@hrms-core/core/user/user.service';
import { AuthFacade } from './auth.facade';
import { USERS } from '@hrms-core/test/mock/user-mock';
import { MockUtils } from '@hrms-core/test/utils/mock.utils';
import { EnvService } from '@libs/env';

describe('Auth Facade', () => {
    let authFacade: AuthFacade;
    let dbManager: DBManager;
    let envService: EnvService;
    let loggerService: LoggerService;
    let roleService: RoleService;
    let userService: UserService;
    let mockUtils: MockUtils;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
        authFacade = moduleRef.get<AuthFacade>(AuthFacade);

        userService = moduleRef.get<UserService>(UserService);
        roleService = moduleRef.get<RoleService>(RoleService);
        envService = moduleRef.get<EnvService>(EnvService);
        mockUtils = new MockUtils(envService, roleService, userService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Validate User', () => {
        it('Should not accept empty email', async () => {
            expect.assertions(1);

            await expect(authFacade.auth(USERS.userWithoutEmail)).rejects.toEqual(
                expect.objectContaining({
                    message: 'No email address provided!',
                }),
            );
        });

        it('Should not accept invalid email', async () => {
            expect.assertions(1);

            await expect(authFacade.auth(USERS.userWithInvalidEmail)).rejects.toEqual(
                expect.objectContaining({ message: 'Invalid email provided!' }),
            );
        });

        it('Should not accept empty password', async () => {
            expect.assertions(1);

            await expect(authFacade.auth(USERS.userWithoutPassword)).rejects.toEqual(
                expect.objectContaining({ message: 'No password provided!' }),
            );
        });

        it('Should not accept invalid user credentials', async () => {
            //const role = await roleService.create(USERS.employeeRole);
            expect.assertions(1);
            await mockUtils.createUser('basicUser');
            const loginCredentials = {
                email: 'invalid-user@mail.com',
                password: 'invalid',
            };
            await expect(authFacade.auth(loginCredentials)).rejects.toEqual(
                expect.objectContaining({
                    message: 'Invalid login credentials',
                }),
            );
        });

        it('Should accept authentication', async () => {
            expect.assertions(1);
            jest.setTimeout(30000);

            const loginCredentials = {
                email: USERS.basicUser.email,
                password: USERS.basicUser.password,
            };

            await mockUtils.createUser('basicUser', 'employeeRole');

            await authFacade.auth(loginCredentials).then(result => {
                expect(result.token.length).toBeGreaterThan(1);
            });
        });
    });
});
