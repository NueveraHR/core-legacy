import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { User } from './user.schema';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import * as bcrypt from 'bcrypt';

const MOCK_DATA = {
    basicUser: {
        username: 'nuevera',
        password: 'areveun',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
    }
};

describe('User Domain', () => {
    let userService: UserService;
    let dbManager: DBManager;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        userService = moduleRef.get<UserService>(UserService);
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
            })
        });
    });

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

    });
})