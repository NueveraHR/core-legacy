import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { ProfileManagementModule } from './modules/profile-management/profile-management.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { DBModule } from 'apps/hrms-db/src/db.module';


@Module({
  imports: [
    DBModule,
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    ConfigurationModule,
    UserManagementModule,
    ProfileManagementModule,
  ],
})
export class CoreModule { }
