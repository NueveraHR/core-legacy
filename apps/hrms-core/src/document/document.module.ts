import { Module, HttpModule } from '@nestjs/common';
import { DocumentMangmentService } from './document-mangment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema, Document } from './document.schema';
import { EnvModule } from '@libs/env';

@Module({
    imports: [EnvModule, HttpModule, MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }])],
    providers: [DocumentMangmentService],
    exports: [DocumentMangmentService],
})
export class DocumentModule {}
