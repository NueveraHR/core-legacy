import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { EnvModule } from '@libs/env';

@Global()
@Module({
    imports: [EnvModule],
    providers: [LoggerService],
    exports: [LoggerService],
})
export class LoggerModule {}
