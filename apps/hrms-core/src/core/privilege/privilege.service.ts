import { Injectable } from "@nestjs/common";
import { HRMSConfigService } from "@libs/config";
import { PortalPrivilegesConfig, PortalPrivileges } from "./privilege.model";

const PRIVILEGE_FILE_NAME = 'privilege.json';

@Injectable()
export class PrivilegeService {
    private privilegeConfig: PortalPrivilegesConfig;

    constructor(private readonly configService: HRMSConfigService) {
        this.privilegeConfig = null;
    }


    loadConfig(fileName: string = PRIVILEGE_FILE_NAME): PortalPrivilegesConfig | never {
        if (!this.privilegeConfig) {
            this.privilegeConfig = this.configService.load(fileName) as PortalPrivilegesConfig;
        }

        return this.privilegeConfig;
    }

    getPortalPrivileges(portal: string): PortalPrivileges | never {
        if (!this.privilegeConfig) {
            throw Error('Unknown config, Did you forget to call loadConfig() ?');
        }

        if (!this.privilegeConfig[portal]) {
            throw Error(`Unknown portal with given name: ${portal}`);
        }

        return this.privilegeConfig[portal];
    }

    
}