import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { CommonApi } from './common/common-api.module';

import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from '@hrms-core/core/document/multerConfig.service';
import { EmployeeResolver } from './employee/employee.resolver';
import { RoleResolver } from './role/role.resolver';

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
    providers: [RoleResolver, EmployeeResolver],
    controllers: [],
})
export class AppModule {}
