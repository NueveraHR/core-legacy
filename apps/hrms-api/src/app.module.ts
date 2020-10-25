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
import { CertificationResolver } from './employee/certification.resolver';
import { LanguageResolver } from './employee/language.resolver';
import { JobResolver } from './employee/job.resolver';
import { PassportResolver } from './employee/passport.resolver';
import { HrmsFacadesModule } from 'apps/hrms-facade/src/hrms-facades.module';
import { join } from 'path';
import { AppController } from './app.controller';
import { JwtDocumentMiddleware } from './common/middlewares/jwt-document.middleware';

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
        HrmsFacadesModule,
        CommonApi,
        HRMSCoreModule, // TODO: Remove after exposing document facade
    ],
    providers: [
        AuthResolver,
        RoleResolver,
        EmployeeResolver,
        JobResolver,
        EducationResolver,
        CertificationResolver,
        LanguageResolver,
        PassportResolver,
        UploadResolver,
    ],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtDecryptMiddleware).forRoutes('/');
        consumer.apply(JwtDocumentMiddleware).forRoutes('/document');
    }
}
