import { Module, Global } from '@nestjs/common';
import { DBManager } from './services/database/database-manager.service';
import { ErrorService } from './error/error.service';
import { EnvModule } from '@libs/env';
import { MongoConnectionService } from './services/database/mongo-connection.service';

@Global()
@Module({
    imports: [EnvModule],
    providers: [DBManager, MongoConnectionService, ErrorService],
    exports: [DBManager, MongoConnectionService, ErrorService],
})
export class CommonModule {}
