import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { HRMSCoreModule } from '@hrms-core/hrms-core.module';
import { CommonApi } from './common/common-api.module';

import { EmployeeResolver } from './employee/employee.resolver';
import { RoleResolver } from './role/role.resolver';
import { AuthResolver } from './auth/auth.resolver';
import { UploadResolver } from './upload/upload.resolver';
import { JwtDecryptMiddleware } from './common/middlewares/jwt-decrypt.middleware';
import { EducationResolver } from './employee/education.resolver';

@Module({
    imports: [
        GraphQLModule.forRoot({
            autoSchemaFile: 'schema.gql',
            context: ({ req, res }) => ({ req, res }),
            cors: {
                origin: true,
                credentials: true,
            },
        }),
        HRMSCoreModule,
        CommonApi,
    ],
    providers: [AuthResolver, RoleResolver, EmployeeResolver, EducationResolver, UploadResolver],
    controllers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtDecryptMiddleware).forRoutes('/');
    }
}
