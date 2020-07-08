import { Test } from "@nestjs/testing";
import { HRMSCoreModule } from "@hrms-core/hrms-core.module";
import { DBManager } from "@hrms-core/common/services/database/database-manager.service";
import { LoggerService } from "@libs/logger";
import {RoleConfigurationFacade} from "./role-configuration.facade";
import { RoleService } from "@hrms-core/core/role/role.service";

const MOCK_DATA = {}

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

    describe('should Return All Roles', () => {
        it('should Return All Roles', async () => {
            
        });
    });
    describe('should return roleDetails', () => {
        it('should return roleDetails', async () => {
            
        });
    });
    describe('should return all privileges', () => {
        it('should return all privileges', async () => {
            
        });
    });
    describe('should Ensure Role Creation', () => {
        it('should Ensure Role Creation', async () => {
            
        });
    });
    describe('should Ensure role update', () => {
        it('should Ensure role update', async () => {
            
        });
    });
    describe('should Ensure deleteRole', () => {
        it('should Ensure deleteRole', async () => {
            
        });
    });
});