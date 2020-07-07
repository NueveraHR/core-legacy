import { AuthController } from "./auth/auth.controller";
import { Module } from "@nestjs/common";
import { AuthModule } from "@hrms-core/common/auth/auth.module";
import { AuthFacade } from "@hrms-core/common/auth/auth.facade";



@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
  ],
})
export class CommonApi { }
