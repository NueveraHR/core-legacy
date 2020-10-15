import { NestFactory, Reflector } from '@nestjs/core';
import * as helmet from 'helmet';
import { EnvService } from '@libs/env';
import * as cookieParser from 'cookie-parser';
import { AppModule } from '@hrms-api/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);

    app.use(cookieParser());
    if (app.get(EnvService).isProd()) {
        app.use(helmet());
    }

    app.enableCors({
        origin: true,
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

    await app.listen(3000);
}
bootstrap();
