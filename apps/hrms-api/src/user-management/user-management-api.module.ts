import { Module } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserManagementModule } from "@hrms-core/modules/user-management/user-management.module";

@Module({
    imports: [
        UserManagementModule
    ],
    controllers: [
        UserController
    ],
    providers: [

    ],
})
export class UserManagementApi { }