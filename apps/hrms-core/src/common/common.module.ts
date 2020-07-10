import { Module, Global } from '@nestjs/common';
import { DBManager } from './services/database/database-manager.service';
import { DtoService } from './services/dto/error-dto.service';

@Global()
@Module({
    providers: [
        DBManager,
        DtoService
    ],
    exports: [
        DBManager,
        DtoService
    ]
})
export class CommonModule { }
