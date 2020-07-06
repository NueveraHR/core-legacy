import { Test } from '@nestjs/testing';
import { DBManager } from '@hrms-core/shared/services/database/database-manager.service';
import { RoleService } from '@hrms-core/core/role/role.service';
import { LoggerService } from '@libs/logger';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { UserService } from '@hrms-core/core/user/user.service';
import { AuthFacade } from './auth.facade';

const MOCK_DATA = {
    basicUser: {
        username: 'nuevera',
        email: 'n@nuevera.com',
        cin: '12345678',
        password: 'areveun',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    },
    employeeRole: {
        name: 'employee',
        description: 'Enterprise employee',
        privileges: {
            user: {
                portals: [
                    "self-service"
                ],
                pages: [
                    "my-profile"
                ],
                actions: [
                    "my-profile.requests.create",
                    "my-profile.requests.read",
                    "my-profile.requests.update",
                    "my-profile.requests.delete",

                    "my-profile.documents.add",
                    "my-profile.documents.read",
                    "my-profile.documents.update",
                    "my-profile.documents.delete"
                ]
            }
        }
    },
    userAuthDataWithInvalidEmail: {
        email: 'test',
        password: '0000'
    },
    userAuthDataWithoutEmail: {
        email: '',
        password: '0000'
    },
    userAuthDataWithoutPassword: {
        email: 'n@nuevera.com',
        password: ''
    }
};
describe('Auth Facade', () => {
    let authFacade: AuthFacade;
    let dbManager: DBManager;
    let loggerService: LoggerService;
    let roleService: RoleService;
    let userService: UserService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        authFacade = moduleRef.get<AuthFacade>(AuthFacade);
        dbManager = moduleRef.get<DBManager>(DBManager);
        userService = moduleRef.get<UserService>(UserService);
        roleService = moduleRef.get<RoleService>(RoleService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Validate User', () => {
        it('Should not accept empty email', async () => {

        });

        it('Should not accept empty password', async () => {

        });

        it('Should not accept empty email', async () => {

        });

        it('Should not accept invalid information', async () => {

        });

        it('Should accept the valid information', async () => {

        });

    });

});