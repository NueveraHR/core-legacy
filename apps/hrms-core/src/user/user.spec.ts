import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import { User } from './user.schema';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import * as bcrypt from 'bcrypt';
import { LoggerService } from '@libs/logger';
import { RoleService } from '../role/role.service';
import { PaginateResult } from 'mongoose';
import { EducationService } from './education/education.service';
import { CertificationService } from './certification/certification.service';
import { SkillService } from './skill/skill.service';
import { USERS } from '@hrms-core/test/mock/user.mock';
import { EDUCATION } from '@hrms-core/test/mock/education.mock';
import { CERTIFICATION } from '@hrms-core/test/mock/certification.mock';
import { LanguageService } from './language/language.service';
import { LANGUAGE } from '@hrms-core/test/mock/language.mock';
import { SKILLS } from '../test/mock/skill.mock';

describe('User Service', () => {
    let userService: UserService;
    let roleService: RoleService;
    let skillService: SkillService;
    let educationService: EducationService; // TODO: Remove this dependency as ut should be self-encapsulated
    let certificationService: CertificationService; // TODO: Remove this dependency as ut should be self-encapsulated
    let languageService: LanguageService; // TODO: Remove this dependency as ut should be self-encapsulated
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
        skillService = moduleRef.get<SkillService>(SkillService);
        educationService = moduleRef.get<EducationService>(EducationService);
        certificationService = moduleRef.get<CertificationService>(CertificationService);
        languageService = moduleRef.get<LanguageService>(LanguageService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create User', () => {
        const user = USERS.basicUser;

        it('should accept basic user', async () => {
            expect.assertions(1);
            await expect(userService.create(user)).resolves.not.toEqual(null);
        });

        it('should hash user password correctly', async () => {
            let createdUser: User;
            await userService.create(user).then(user => (createdUser = user));
            await expect(bcrypt.compare(user.password, createdUser.password)).resolves.toBeTruthy();
        });

        it('Should not accept duplicated username', async () => {
            await expect(userService.create(user)).resolves.toEqual(
                expect.objectContaining({ username: user.username }),
            );
            await userService
                .create(user)
                .then(user => {
                    fail('Saved user with duplicated username, !!!!! THIS SHOULD NOT HAPPEN !!!!!');
                })
                .catch(err => {
                    expect(err).not.toEqual(null);
                });
        });

        it('Should not accept duplicated email', async () => {
            await expect(userService.create(user)).resolves.toEqual(
                expect.objectContaining({ username: user.username }),
            );
            await userService
                .create(USERS.basicUserDuplicatedEmail)
                .then(user => {
                    fail('Saved user with duplicated email, !!!!! THIS SHOULD NOT HAPPEN !!!!!');
                })
                .catch(err => {
                    expect(err).not.toEqual(null);
                });
        });
    });

    describe('Update User', () => {
        const userDto = USERS.basicUser;
        const newPassword = 'Nuevera';

        let user: User;

        it('Correctly updates user password', async () => {
            user = await userService.create(userDto);
            user.password = newPassword;
            await userService.update(user).then(updatedUser => (user = updatedUser));
            await expect(bcrypt.compare(newPassword, user.password)).resolves.toBeTruthy();
        });

        it('Ignores password update when not modified', async () => {
            user = await userService.create(userDto);

            await userService.update(user).then(updatedUser => (user = updatedUser));
            await expect(bcrypt.compare(userDto.password, user.password)).resolves.toBeTruthy();
        });

        it('Attaches role to user successfully', async () => {
            user = await userService.create(userDto);
            const role = await roleService.create(USERS.employeeRole);
            userService.attachRole(user, role).then(updatedUser => {
                expect(updatedUser.role).not.toBeUndefined();
                expect(updatedUser.role).not.toBeNull();
                expect(typeof updatedUser.role).toEqual('string');
                expect((updatedUser.role as string).length).toBeGreaterThan(1);
            });
        });

        it('Attaches skill to user', async () => {
            user = await userService.create(userDto);
            let i = 0;
            const results: User[] = [];
            while (i < 2 && ++i) {
                const skill = await skillService.create(SKILLS.frontend);
                const res = await userService.attachSkill(user.id, skill.id);
                results.unshift(res);
                expect(results[0].skills.length).toEqual(i);
            }
        });

        it('Attaches education to user', async () => {
            user = await userService.create(userDto);
            let i = 0;
            const results: User[] = [];
            while (i < 2 && ++i) {
                const ed = await educationService.create(EDUCATION.full);
                const res = await userService.attachEducation(user.id, ed.id);
                results.unshift(res);
                expect(results[0].educationHistory.length).toEqual(i);
            }
        });

        it('Attaches certification to user', async () => {
            user = await userService.create(userDto);
            let i = 0;
            const results: User[] = [];
            while (i < 2 && ++i) {
                const cert = await certificationService.create(CERTIFICATION.full);
                const res = await userService.attachCertification(user.id, cert.id);
                results.unshift(res);
                expect(results[0].certifications.length).toEqual(i);
            }
        });

        it('Attaches language to user', async () => {
            user = await userService.create(userDto);
            let i = 0;
            const results: User[] = [];
            while (i < 2 && ++i) {
                const lang = await languageService.create(LANGUAGE.en);
                const res = await userService.attachLanguage(user.id, lang.id);
                results.unshift(res);
                expect(results[0].languages.length).toEqual(i);
            }
        });
    });

    describe('Find User', () => {
        const userDto = USERS.basicUser;

        beforeAll(async () => {
            await dbManager.dropDatabaseCollections();
        });

        it('Should find all added users', async () => {
            await userService.create(userDto);
            const foundUsers = await userService.findAll().catch(() => fail(`Couldn't fetch added users from DB`));

            expect(foundUsers).toBeInstanceOf(Array);
            expect(foundUsers.length).toBeGreaterThanOrEqual(1);
        });

        it('should find all added user paginated', async () => {
            //expect.assertions(2);

            for (let i = 0; i < 24; i++) {
                const generatedUser = {
                    username: `${i}`,
                    email: `${i}`,
                    password: `${i}`,
                    cin: `${i}`.padStart(8, '0'),
                };
                await userService.create(generatedUser);
            }
            await expect(userService.findAll()).resolves.toBeInstanceOf(Array);
            await userService.findAll().then(users => {
                expect(users.length).toEqual(24);
            });
            await userService.findAllPaginated(3, 10).then((users: PaginateResult<User>) => {
                expect(users.total).toEqual(24); // 24 registered users
                expect(users.pages).toEqual(3); // 3 pages
                expect(users.docs.length).toEqual(4); // 4 users on page 3
            });
        });

        it('Should find user by username', async () => {
            await userService.create(userDto);

            await expect(userService.findByUsername(userDto.username)).resolves.toEqual(
                expect.objectContaining({ username: userDto.username }),
            );
        });

        it('Should find user by email', async () => {
            await userService.create(userDto);

            await expect(userService.findByEmail(userDto.email)).resolves.toEqual(
                expect.objectContaining({ email: userDto.email }),
            );
        });

        it('should find a populated user role', async () => {
            const user = await userService.create(userDto);

            const role = await roleService.create(USERS.employeeRole);
            await userService.attachRole(user, role);
            await userService.findByUsername(userDto.username).then(user => {
                expect(user.role).not.toBeUndefined();
                expect(user.role).not.toBeNull();
                expect(user.role).toHaveProperty('name');
                expect(user.role).toHaveProperty('privileges');
            });
        });
    });

    describe('Delete User', () => {
        const userDto = USERS.basicUser;
        it('should delete user successfully', async () => {
            const user = await userService.create(userDto);
            await expect(userService.delete(user)).resolves.toEqual(expect.objectContaining({ deletedCount: 1 }));
            //expect(user).toBe(null);
        });
    });
});
