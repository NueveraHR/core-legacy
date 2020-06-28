import { Test } from "@nestjs/testing";
import { HRMSCoreModule } from "@hrms-core/hrms-core.module";
import { DBManager } from "@hrms-core/shared/services/database/database-manager.service";
import { LoggerService } from "@libs/logger";
import { RoleService } from "./role.service";
import { async } from "rxjs/internal/scheduler/async";
import { Role } from "./role.schema";

const MOCK_DATA = {
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
    },
    employeeRole: {
        name: 'employee',
        description: 'Enterprise employee',
        privileges: [
            'self-service.access',

            'self-service.pages.profile',
            'self-service.pages.details',

            'self-service.actions.self.details.approve',
            'self-service.actions.self.details.create',
            'self-service.actions.self.details.read',
            'self-service.actions.self.details.update',
            'self-service.actions.self.details.delete',
        ]
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
            expect(role.privileges.length).toEqual(6)

        });
    });

    describe('Update Role', () => {
        it('should update role successfully', async () => {
            let role = await roleService.create(MOCK_DATA.managerRole);
            expect(role).not.toBeUndefined();
            expect(role).not.toBeNull();
            expect(role).toHaveProperty('privileges');

            role.privileges = [];
            await roleService.update(role);

            expect(role.privileges.length).toEqual(0)
        });
    });

    describe('Find Role', () => {
        beforeEach(async () => {
            await roleService.create(MOCK_DATA.managerRole);
        });

        it('should find all created roles', async () => {
            await roleService.create(MOCK_DATA.employeeRole);

            expect(roleService.findAll()).resolves.toHaveLength(2);
        });

        it('should find role by  name', async () => {
            expect(roleService.findByRoleName(MOCK_DATA.managerRole.name)).resolves
                .not.toBeNull();
            //.toEqual(expect.objectContaining({ description: MOCK_DATA.managerRole.description }));
        });
    });

})