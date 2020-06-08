import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { User } from './user.schema';
import { CoreModule } from '@hrms-core/core.module';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { userDTO } from './user.dto';

describe('User Domain', () => {
    let userService: UserService;
    let dbManager: DBManager;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [CoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        userService = moduleRef.get<UserService>(UserService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create User', () => {
        it('should accept basic user', async () => {
            const userDtoMock: userDTO = {
                username: 'nuevera',
                firstName: 'John',
                lastName: 'Doe',
            };

            expect.assertions(1);
            await expect(userService.create(userDtoMock)).resolves.not.toEqual(null);
        });

        it('Should not accept duplicated username', async () => {
            const userDtoMock: userDTO = { username: 'nuevera', firstName: 'John', lastName: 'Doe', };

            await expect(userService.create(userDtoMock)).resolves.toEqual(expect.objectContaining({ username: 'nuevera' }));
            await userService.create(userDtoMock).then(user => {
                fail('Saved user with duplicated username, THIS SHOULD NOT HAPPEN');
            }).catch(err => {
                expect(err).not.toEqual(null);
            })
        })
    });

    describe('Read User', () => {
        it('Should find created user', async () => {
            const userDtoMock: userDTO = {
                username: 'nuevera',
                firstName: 'John',
                lastName: 'Doe',
            };
            let foundUsers: User[];

            await userService.create(userDtoMock);
            await userService.findAll().then(users => foundUsers = users);


            expect.assertions(3);
            expect(foundUsers).toBeInstanceOf(Array);
            expect(foundUsers.length).toBeGreaterThanOrEqual(1);
            expect(foundUsers.filter(user => user.firstName == 'John').length).toBeGreaterThanOrEqual(1);
        })
    });
})