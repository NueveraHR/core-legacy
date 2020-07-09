import { Test } from "@nestjs/testing";
import { HRMSCoreModule } from "@hrms-core/hrms-core.module";
import { DBManager } from "@hrms-core/common/services/database/database-manager.service";
import { LoggerService } from "@libs/logger";
import { RoleService } from "./role.service";
import { ROLES } from "@hrms-core/mock/role-mock";


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
            expect.assertions(6);

            let role = await roleService.create(ROLES.managerRole);
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
            expect.assertions(4);

            let role = await roleService.create(ROLES.managerRole);
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
            await roleService.create(ROLES.managerRole).then(role => {
                randomRoleId = role.id;
            });
        });

        it('should find all created roles', async () => {
            expect.assertions(1);

            await roleService.create(ROLES.employeeRole);
            await expect(roleService.findAll()).resolves.toHaveLength(2);
        });

        it('should find role by name', async () => {
            expect.assertions(1);

            await expect(roleService.findByRoleName(ROLES.managerRole.name)).resolves
                .not.toBeNull();
            //.toEqual(expect.objectContaining({ description: ROLES.managerRole.description }));
        });

        it('should find role by id', async () => {
            expect.assertions(1);

            await expect(roleService.findById(randomRoleId)).resolves
                .not.toBeNull();
        });
    });

    describe('Delete Role', () => {
        it('should remove role successfully', async () => {
            expect.assertions(1);

            let role = await roleService.create(ROLES.managerRole);
            await expect(roleService.delete(role)).resolves
                .toEqual(expect.objectContaining({ deletedCount: 1 }));
        });
    });
});