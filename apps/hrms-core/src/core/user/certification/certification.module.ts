import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Certification, CertificationSchema } from './certification.schema';
import { CertificationService } from './certification.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Certification.name, schema: CertificationSchema }])],
    providers: [CertificationService],
    exports: [CertificationService],
})
export class CertificationModule {}
