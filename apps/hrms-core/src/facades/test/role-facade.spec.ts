import { Test } from '@nestjs/testing';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { DBManager } from '@hrms-core/common/services/database/database-manager.service';
import { LoggerService } from '@libs/logger';
import { RoleFacade, MultipleDeleteResult } from '../role.facade';
import { ROLES } from '@hrms-core/test/mock/role-mock';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { RoleDto, RolePaginateDto } from '@hrms-core/dto/role.dto';
import { Role } from '@hrms-core/core/role/role.schema';

describe('Role Management Facade', () => {
    let dbManager: DBManager;
    let roleManagementFacade: RoleFacade;
    let loggerService: LoggerService;
    let errorService: ErrorService;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HRMSCoreModule],
            providers: [],
            controllers: [],
        }).compile();

        dbManager = moduleRef.get<DBManager>(DBManager);
        loggerService = moduleRef.get<LoggerService>(LoggerService);
        roleManagementFacade = moduleRef.get<RoleFacade>(RoleFacade);
        errorService = moduleRef.get<ErrorService>(ErrorService);
    });

    beforeAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    afterAll(async () => {
        await dbManager.dropDatabaseCollections();
    });

    describe('Role Facade successful tests', () => {
        let createdRole: RoleDto;
        const roleDto = ROLES.managerRole;

        it('should find all added user paginated', async () => {
            expect.assertions(4);

            for (let i = 0; i < 24; i++) {
                const generatedRole: RoleDto = {
                    name: `${ROLES.managerRole.name}-${i}`,
                    description: `${ROLES.managerRole.name}-${i}`,
                    privileges: ROLES.managerRole.privileges,
                };
                await roleManagementFacade.createRole(generatedRole);
            }
            await roleManagementFacade.allRoles().then((roles: RolePaginateDto) => {
                expect(roles.total).toEqual(24);
            });

            await roleManagementFacade.allRoles({ page: 3, pageSize: 10 }).then((roles: RolePaginateDto) => {
                expect(roles.total).toEqual(24); // 24 registered roles
                expect(roles.pages).toEqual(3); // 3 pages
                expect(roles.docs.length).toEqual(4); // 4 users on page 3
            });
        });

        it('should create role', async () => {
            expect.assertions(1);

            await roleManagementFacade
                .createRole(roleDto)
                .then(role => (createdRole = role))
                .catch(err => fail(`could not create role :: ${err.message}`));

            expect(createdRole).toBeInstanceOf(RoleDto);
        });

        it('should update role', async () => {
            expect.assertions(1);
            if (!createdRole || errorService.isError(createdRole)) {
                fail('Cannot update uncreated role');
            }
            createdRole.name = 'Modified role';
            await roleManagementFacade.updateRole(createdRole.id, createdRole).then((role: Role) => {
                expect(role.name).toEqual('Modified role');
            });
        });

        it('should find role details', async () => {
            expect.assertions(1);
            await expect(roleManagementFacade.roleDetails(createdRole.id)).resolves.toBeInstanceOf(RoleDto);
        });

        it('should delete role', async () => {
            expect.assertions(1);
            await expect(roleManagementFacade.deleteRole((createdRole as RoleDto).id)).resolves.toEqual(true);
        });

        it('should delete list of roles', async () => {
            expect.assertions(4);

            const rolesId = [];

            for (let i = 100; i < 105; i++) {
                const generatedRole: RoleDto = {
                    name: `${ROLES.managerRole.name}-${i}`,
                    description: `${ROLES.managerRole.name}-${i}`,
                    privileges: ROLES.managerRole.privileges,
                };
                await roleManagementFacade.createRole(generatedRole).then(res => {
                    rolesId.push(res.id);
                });
            }

            //add a single invalid role id
            rolesId.push('INVALID-ID');

            await roleManagementFacade.deleteMultipleRoles(rolesId).then(result => {
                expect(result).toBeInstanceOf(MultipleDeleteResult);
                expect(result.accepted.length).toEqual(5);
                expect(result.failed.length).toEqual(1);
                expect(Object.keys(result.errors).length).toEqual(1);
            });
        });
    });
});
