import { AuthController } from "./auth/auth.controller";
import { Module } from "@nestjs/common";



@Module({
  imports: [
    
  ],
  controllers: [
      AuthController,
    ],
  providers: [

  ],
})
export class CommonApi { }
