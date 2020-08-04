import { Module } from "@nestjs/common";
import { ConfigModule } from "@hrms-core/modules/config/config.module";
import { RoleController } from "./controllers/role.controller";

@Module({
    imports: [
        ConfigModule,
    ],
    controllers: [
        RoleController,
    ],
    providers: [

    ],
})
export class ConfigApiModule { }