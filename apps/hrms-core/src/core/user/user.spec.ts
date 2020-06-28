import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { User } from './user.schema';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/shared/services/database/database-manager.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '@libs/logger';

const MOCK_DATA = {
    basicUser: {
        username: 'nuevera',
        email: 'n@nuevera.com',
        cin: '12345678',
        role: 'employee',
        password: 'areveun',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    },
    basicUserDuplicatedEmail: {
        username: 'nuevera2',
        email: 'n@nuevera.com',
        cin: '12345678',
        role: 'employee',
        password: 'areveun',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    },
    missingRoleUser: {
        username: 'nuevera',
        password: 'areveun',
        email: 'n@nuevera.com',
        cin: '12345678',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    }
};

describe('User Service', () => {
    let userService: UserService;
    let dbManager: DBManager;
    let loggerService: LoggerService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        userService = moduleRef.get<UserService>(UserService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create User', () => {
        const user = MOCK_DATA.basicUser;

        it('should accept basic user', async () => {
            expect.assertions(1);
            await expect(userService.create(user)).resolves.not.toEqual(null);
        });

        it('should hash user password correctly', async () => {
            let createdUser: User;
            await userService.create(user).then(user => createdUser = user);
            await expect(bcrypt.compare(user.password, createdUser.password)).resolves.toBeTruthy();
        });

        it('Should not accept duplicated username', async () => {
            await expect(userService.create(user)).resolves.toEqual(expect.objectContaining({ username: user.username }));
            await userService.create(user).then(user => {
                fail('Saved user with duplicated username, !!!!! THIS SHOULD NOT HAPPEN !!!!!');
            }).catch(err => {
                expect(err).not.toEqual(null);
            });
        });

        it('Should not accept duplicated email', async () => {
            await expect(userService.create(user)).resolves.toEqual(expect.objectContaining({ username: user.username }));
            await userService.create(MOCK_DATA.basicUserDuplicatedEmail).then(user => {
                fail('Saved user with duplicated email, !!!!! THIS SHOULD NOT HAPPEN !!!!!');
            }).catch(err => {
                expect(err).not.toEqual(null);
            });
        });
    });

    describe('Update User', () => {
        const mockUserDTO = MOCK_DATA.basicUser;
        const newPassword = 'Nuevera';

        it('Correctly update user password', async () => {
            let user = await userService.create(mockUserDTO);
            user.password = newPassword;
            await userService.update(user).then(updatedUser => user = updatedUser);
            await expect(bcrypt.compare(newPassword, user.password)).resolves.toBeTruthy();
        });

        it('ignore password update when not modified', async () => {
            let user = await userService.create(mockUserDTO);
            await userService.update(user).then(updatedUser => user = updatedUser);
            await expect(bcrypt.compare(mockUserDTO.password, user.password)).resolves.toBeTruthy();

        })
    })

    describe('Read User', () => {

        const user = MOCK_DATA.basicUser;

        it('Should find all added users', async () => {
            let foundUsers: User[];

            await userService.create(user);
            await userService.findAll().then(users => {
                foundUsers = users;
            }).catch(err => {
                fail(`Couldn't fetch added users from DB`);
            });

            expect.assertions(2);
            expect(foundUsers).toBeInstanceOf(Array);
            expect(foundUsers.length).toBeGreaterThanOrEqual(1);

        });

        it('Should find user by username', async () => {
            await userService.create(user);

            await expect(userService.findByUsername(user.username)).resolves
                .toEqual(expect.objectContaining({ username: user.username }))

        });

        it('Should find user by email', async () => {
            await userService.create(user);

            await expect(userService.findByEmail(user.email)).resolves
                .toEqual(expect.objectContaining({ email: user.email }))

        });

    });
})