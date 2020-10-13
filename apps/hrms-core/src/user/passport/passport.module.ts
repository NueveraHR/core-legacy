import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Passport, PassportSchema } from './passport.schema';
import { PassportService } from './passport.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Passport.name, schema: PassportSchema }])],
    providers: [PassportService],
    exports: [PassportService],
})
export class PassportModule {}
