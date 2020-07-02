import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { User } from './user.schema';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/shared/services/database/database-manager.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '@libs/logger';
import { RoleService } from '../role/role.service';
import { userDTO } from '@hrms-core/dto/user.dto';

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
    basicUserDuplicatedEmail: {
        username: 'nuevera2',
        email: 'n@nuevera.com',
        cin: '12345678',
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
    },
    managerRole: {
        name: 'manager',
        description: 'Enterprise manager',
        privileges: [
            'management.access',

            'management.pages.roles',

            'management.actions.manage.roles.create',
            'management.actions.manage.roles.read',
            'management.actions.manage.roles.update',
            'management.actions.manage.roles.delete'
        ]
    }
};

describe('User Service', () => {
    let userService: UserService;
    let roleService: RoleService;
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
        roleService = moduleRef.get<RoleService>(RoleService);
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
        const userDto = MOCK_DATA.basicUser;
        const newPassword = 'Nuevera';

        let user: User;

        it('Correctly updates user password', async () => {
            user = await userService.create(userDto);
            user.password = newPassword;
            await userService.update(user).then(updatedUser => user = updatedUser);
            await expect(bcrypt.compare(newPassword, user.password)).resolves.toBeTruthy();
        });

        it('Ignores password update when not modified', async () => {
            user = await userService.create(userDto);

            await userService.update(user).then(updatedUser => user = updatedUser);
            await expect(bcrypt.compare(userDto.password, user.password)).resolves.toBeTruthy();
        });

        it('Attaches role to user successfully', async () => {
            user = await userService.create(userDto);
            let role = await roleService.create(MOCK_DATA.managerRole);
            userService.attachRole(user, role).then(updatedUser => {
                expect(updatedUser.role).not.toBeUndefined()
                expect(updatedUser.role).not.toBeNull()
                expect(typeof updatedUser.role).toEqual('string');
                expect((updatedUser.role as string).length).toBeGreaterThan(1);
            })

        });
    });

    describe('Find User', () => {

        const userDto = MOCK_DATA.basicUser;

        beforeAll(async () => {
            await dbManager.dropDatabaseCollections();
        });

        it('Should find all added users', async () => {
            await userService.create(userDto);
            let foundUsers: User[];

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
            await userService.create(userDto);

            await expect(userService.findByUsername(userDto.username)).resolves
                .toEqual(expect.objectContaining({ username: userDto.username }))

        });

        it('Should find user by email', async () => {
            await userService.create(userDto);

            await expect(userService.findByEmail(userDto.email)).resolves
                .toEqual(expect.objectContaining({ email: userDto.email }))

        });

        it('should find a populated user role', async () => {
            let user = await userService.create(userDto);

            let role = await roleService.create(MOCK_DATA.managerRole);
            await userService.attachRole(user, role);
            await userService.findByUsername(userDto.username).then(user => {
                expect(user.role).not.toBeUndefined();
                expect(user.role).not.toBeNull();
                expect(user.role).toHaveProperty('name');
                expect(user.role).toHaveProperty('privileges');
            })

        });

    });

    describe('Delete User', () => {
        const userDto = MOCK_DATA.basicUser;
        it('should delete user successfully', async () => {
            let user = await userService.create(userDto);
            await expect(userService.delete(user)).resolves
            .toEqual(expect(user).toBeNull());
            //expect(user).toBe(null);
        });
    });
})