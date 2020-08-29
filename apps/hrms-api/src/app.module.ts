import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { CommonApi } from './common/common-api.module';

import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@hrms-core/core/document/multerConfig.service';
import { UploadController } from './upload/upload.controller';
import { EmployeeRecordController } from './controllers/record.controller';
import { RoleController } from './controllers/role.controller';
import { EmployeeProfileController } from './controllers/profile.controller';
import { EmployeeResolver } from './resolvers/employee.resolver';

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            context: ({ req }) => ({ req }),
        }),
        HRMSCoreModule,
        CommonApi,
        MulterModule.registerAsync({ useClass: MulterConfigService }),
    ],
    providers: [EmployeeResolver],
    controllers: [],
})
export class AppModule {}
