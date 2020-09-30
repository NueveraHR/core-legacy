import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Certification, CertificationSchema } from './certification.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Certification.name, schema: CertificationSchema }])],
    providers: [],
})
export class CertificationModule {}
