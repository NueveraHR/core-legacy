import { Test } from '@nestjs/testing';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { RoleService } from '@hrms-core/core/role/role.service';
import { LoggerService } from '@libs/logger';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { UserService } from '@hrms-core/core/user/user.service';
import { AuthFacade } from './auth.facade';
import { ErrorDto } from '@hrms-core/dto/error.dto';
import { USERS } from '@hrms-core/mock/user-mock';


describe('Auth Facade', () => {
    let authFacade: AuthFacade;
    let dbManager: DBManager;
    let loggerService: LoggerService;
    let roleService: RoleService;
    let userService: UserService;


    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [
            ],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
        authFacade = moduleRef.get<AuthFacade>(AuthFacade);

        userService = moduleRef.get<UserService>(UserService);
        roleService = moduleRef.get<RoleService>(RoleService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Validate User', () => {
        it('Should not accept empty email', async () => {
            expect(authFacade.auth(USERS.userWithoutEmail)).resolves.toBeInstanceOf(ErrorDto);
            expect(authFacade.auth(USERS.userWithoutEmail)).resolves.toEqual(expect.objectContaining({ message: 'No email address provided' }));
        });

        it('Should not accept invalid email', async () => {
            expect(authFacade.auth(USERS.userWithInvalidEmail)).resolves.toBeInstanceOf(ErrorDto);
            expect(authFacade.auth(USERS.userWithInvalidEmail)).resolves.toEqual(expect.objectContaining({ message: 'Invalid email provided' }));
        });

        it('Should not accept empty password', async () => {
            expect(authFacade.auth(USERS.userWithoutPassword)).resolves.toBeInstanceOf(ErrorDto);
            expect(authFacade.auth(USERS.userWithoutPassword)).resolves.toEqual(expect.objectContaining({ message: 'No password provided' }));
        });

        it('Should not accept invalid user credentials', async () => {
            //const role = await roleService.create(USERS.employeeRole);
            await userService.create(USERS.basicUser);
            const loginCredentials = {
                email: 'invalid-user@mail.com',
                password: 'invalid'
            }
            expect(authFacade.auth(loginCredentials)).resolves.toBeInstanceOf(ErrorDto);
            expect(authFacade.auth(loginCredentials)).resolves.toEqual(expect.objectContaining({ message: 'Invalid login credentials' }));


        });

        it('Should accept authentication', async () => {
            await userService.create(USERS.basicUser);
            const loginCredentials = {
                email: USERS.basicUser.email,
                password: USERS.basicUser.password
            }
            await authFacade.auth(loginCredentials).then(result => {
                expect(result).not.toBeInstanceOf(ErrorDto);
                expect((result as string).length).toBeGreaterThan(1);
            });

        }); 

    });

});