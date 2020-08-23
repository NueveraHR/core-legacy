import { Injectable, Inject } from "@nestjs/common";
import { HRMSConfigService } from "@libs/config";
import { PrivilegeDto } from "../../dto/privilege.dto";

const PRIVILEGE_FILE_NAME = 'privilege.json';

@Injectable()
export class PrivilegeService {
    private privilegeConfig: PrivilegeDto;

    @Inject(HRMSConfigService) configService: HRMSConfigService;

    constructor() {
        this.privilegeConfig = null;
    }


    loadConfig(fileName: string = PRIVILEGE_FILE_NAME): PrivilegeDto | never {
        if (!this.privilegeConfig) {
            this.privilegeConfig = this.configService.load(fileName) as PrivilegeDto;
        }

        return this.privilegeConfig;
    }


    get privileges(): PrivilegeDto {
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