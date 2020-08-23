import { Module } from '@nestjs/common';
import { DocumentMangmentService } from './document-mangment.service';
import { MulterConfigService } from './multerConfig.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema, Document } from './document.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Document.name, schema: DocumentSchema }])],
    providers: [DocumentMangmentService, MulterConfigService],
    exports: [DocumentMangmentService, MulterConfigService],
})
export class DocumentModule {}
