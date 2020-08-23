import { Injectable } from '@nestjs/common';
import { EnvService } from '@libs/env';
import * as fs from 'fs';

@Injectable()
export class HRMSConfigService {
    private configBasePath: string;

    constructor(private readonly envService: EnvService) {
        this.configBasePath = this.envService.read().CONFIG_PATH;
    }

    load(fileName: string): any | never {
        if (!this.configBasePath) {
            throw Error(`Couldn't infer environnement config file path`); // TODO: log
        }
        return JSON.parse(fs.readFileSync(`${this.configBasePath}/${fileName}`).toString());
    }
}
