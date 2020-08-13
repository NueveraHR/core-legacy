import { Module, Global } from '@nestjs/common';
import { DBManager } from './services/database/database-manager.service';
import { ErrorService } from './error/error.service';

@Global()
@Module({
    providers: [
        DBManager,
        ErrorService
    ],
    exports: [
        DBManager,
        ErrorService
    ]
})
export class CommonModule { }
