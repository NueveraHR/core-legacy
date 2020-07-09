import { Test } from "@nestjs/testing";
import { HRMSCoreModule } from "@hrms-core/hrms-core.module";
import { DBManager } from "@hrms-core/common/services/database/database-manager.service";
import { LoggerService } from "@libs/logger";
import { RoleManagementFacade } from "./role-management.facade";
import { ROLES } from "@hrms-core/mock/role-mock";
import { ErrorDto } from "@hrms-core/dto/error.dto";
import { RoleDto } from "@hrms-core/dto/role.dto";


describe('Role Management Facade', () => {
    let dbManager: DBManager;
    let roleManagementFacade: RoleManagementFacade;
    let loggerService: LoggerService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
        roleManagementFacade = moduleRef.get<RoleManagementFacade>(RoleManagementFacade);

    });

    beforeAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Role Facade successful tests', () => {
        let createdRole: RoleDto | ErrorDto;
        const roleDto = ROLES.managerRole;

        it('should create role', async () => {
            await roleManagementFacade.createRole(roleDto)
                .then(role => createdRole = role)
                .catch(err => fail(`could not create role :: ${err.message}`));

            expect(createdRole).toBeInstanceOf(RoleDto);
        });

        it('should update role', async () => {
            if (!createdRole || createdRole instanceof ErrorDto) {
                fail('Cannot update uncreated role');
            }
            createdRole.name = 'Modified role';
            expect(roleManagementFacade.updateRole(createdRole)).resolves.toEqual(expect.objectContaining({ name: 'Modified role' }));
        });

        it('should find role details', async () => {
            expect(roleManagementFacade.roleDetails(roleDto.name)).resolves.toBeInstanceOf(RoleDto);
        });


        it('should delete role', async () => {
            expect(roleManagementFacade.deleteRole((createdRole as RoleDto).id)).resolves.toEqual(true);
        });

    });


});