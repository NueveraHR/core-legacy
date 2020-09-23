import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { EnvService } from '@libs/env';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const reflector = app.get(Reflector);

    app.use(cookieParser());
    if (!app.get(EnvService).isProd()) {
        app.use(helmet());
        app.enableCors();
    }
    await app.listen(3000);
}
bootstrap();
