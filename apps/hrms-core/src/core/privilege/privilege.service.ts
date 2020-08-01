import { Injectable } from "@nestjs/common";
import { HRMSConfigService } from "@libs/config";
import { Privileges } from "./privilege.model";

const PRIVILEGE_FILE_NAME = 'privilege.json';

@Injectable()
export class PrivilegeService {
    private privilegeConfig: Privileges;

    constructor(private readonly configService: HRMSConfigService) {
        this.privilegeConfig = null;
    }


    loadConfig(fileName: string = PRIVILEGE_FILE_NAME): Privileges | never {
        if (!this.privilegeConfig) {
            this.privilegeConfig = this.configService.load(fileName) as Privileges;
        }

        return this.privilegeConfig;
    }


    get privileges(): Privileges {
        if (!this.privilegeConfig) {
            this.loadConfig();
        }

        return this.privilegeConfig;
    }

    // getModulePrivileges(moduleName: string): ModulePrivileges | never {
    //     if (!this.privilegeConfig) {
    //         this.loadConfig();
    //     }

    //     if (!this.privilegeConfig[moduleName]) {
    //         throw Error(`Unknown module with given name: ${moduleName}`);
    //     }

    //     return this.privilegeConfig[moduleName];
    // }


}