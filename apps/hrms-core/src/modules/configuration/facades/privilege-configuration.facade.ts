import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

import { PrivilegeConfigurationService } from '../services/privilege-configuration.service';

@Injectable()
export class PrivilegeConfigurationFacade {

    constructor(private readonly _moduleRef: ModuleRef) {

    }

    private _privilegeConfigurationService;
    get privilegeConfigurationService(): PrivilegeConfigurationService {
        if (!this._privilegeConfigurationService) {
            this._privilegeConfigurationService = this._moduleRef.get(PrivilegeConfigurationService);
        }
        return this._privilegeConfigurationService;
    }

}
