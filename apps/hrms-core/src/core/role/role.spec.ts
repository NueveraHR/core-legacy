import { Test } from "@nestjs/testing";
import { HRMSCoreModule } from "@hrms-core/hrms-core.module";
import { DBManager } from "@hrms-core/common/services/database/database-manager.service";
import { LoggerService } from "@libs/logger";
import { RoleService } from "./role.service";

const MOCK_DATA = {
    managerRole: {
        name: 'manager',
        description: 'Enterprise manager',
        privileges: {
            config: {
                portals: [
                    "role-config",
                ],
                pages: [
                    "role-list",
                    "role-details"
                ],
                actions: [
                    "all-roles.read",

                    "role.create",
                    "role.delete",
                    "role.update",
                    "role.delete"
                ]
            },

            user: {
                portals: [
                    "user-management",
                ],
                pages: [
                    "new-user",
                    "user-list",
                    "user-details",
                    "requests",
                ],
                actions: [
                    "all-users.read",

                    "user.create",
                    "user.read",
                    "user.update",
                    "user.delete",

                    "user.roles.add",
                    "user.roles.read",
                    "user.roles.update",
                    "user.roles.delete",

                    "user.documents.add",
                    "user.documents.read",
                    "user.documents.update",
                    "user.documents.delete",

                    "requests.read",
                    "requests.approve",
                    "requests.refuse",
                ]
            }
        }
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
}

describe('Role Service', () => {
    let dbManager: DBManager;
    let roleService: RoleService;
    let loggerService: LoggerService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        roleService = moduleRef.get<RoleService>(RoleService);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
    });

    beforeEach(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Create Role', () => {
        it('should create role successfully', async () => {
            let role = await roleService.create(MOCK_DATA.managerRole);
            expect(role).not.toBeUndefined();
            expect(role).not.toBeNull();
            expect(role).toHaveProperty('name');
            expect(role).toHaveProperty('description');
            expect(role).toHaveProperty('privileges');
            expect(Object.keys(role.privileges).length).toEqual(2); // config and user

        });
    });

    describe('Update Role', () => {
        it('should update role successfully', async () => {
            let role = await roleService.create(MOCK_DATA.managerRole);
            expect(role).not.toBeUndefined();
            expect(role).not.toBeNull();
            expect(role).toHaveProperty('privileges');

            role.privileges = {};
            await roleService.update(role);

            expect(Object.keys(role.privileges).length).toEqual(0);
        });
    });

    describe('Find Role', () => {
        let randomRoleId: string;

        beforeEach(async () => {
            await roleService.create(MOCK_DATA.managerRole).then(role => {
                randomRoleId = role.id;
            });
        });

        it('should find all created roles', async () => {
            await roleService.create(MOCK_DATA.employeeRole);

            expect(roleService.findAll()).resolves.toHaveLength(2);
        });

        it('should find role by name', async () => {
            expect(roleService.findByRoleName(MOCK_DATA.managerRole.name)).resolves
                .not.toBeNull();
            //.toEqual(expect.objectContaining({ description: MOCK_DATA.managerRole.description }));
        });

        it('should find role by id', async () => {
            expect(roleService.findById(randomRoleId)).resolves
                .not.toBeNull();
        });
    });

    describe('Delete Role', () => {
        it('should remove role successfully', async () => {
            let role = await roleService.create(MOCK_DATA.managerRole);

            await expect(roleService.delete(role)).resolves
                .toEqual(expect.objectContaining({ deletedCount: 1 }));
        });
    });
});