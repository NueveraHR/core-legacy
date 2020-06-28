import { Module, Global } from '@nestjs/common'
import { LoggerService } from './logger.service'

@Global()
@Module({
  providers: [
    {
      provide: LoggerService,
      useValue: new LoggerService()
    }
  ],
  exports: [ LoggerService ]
})
export class LoggerModule {}