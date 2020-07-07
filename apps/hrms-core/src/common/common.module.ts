import { Module } from '@nestjs/common';
import { DBManager } from './services/database/database-manager.service';

@Module({
    providers: [
        DBManager,
    ],
    exports: [
        DBManager,
    ]
})
export class CommonModule { }
