import { Module } from "@nestjs/common";
import { ConfigManagementModule } from "@hrms-core/modules/config-management/config-management.module";
import { RoleController } from "./controllers/role.controller";

@Module({
    imports: [
        ConfigManagementModule,
    ],
    controllers: [
        RoleController,
    ],
    providers: [

    ],
})
export class ConfigApiModule { }