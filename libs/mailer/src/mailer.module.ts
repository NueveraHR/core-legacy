import { EnvModule } from '@libs/env';
import { LoggerModule } from '@libs/logger';
import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Module({
    imports: [EnvModule, LoggerModule],
    providers: [MailerService],
    exports: [MailerService],
})
export class MailerModule {}
