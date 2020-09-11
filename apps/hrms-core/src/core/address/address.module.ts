import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Address, AddressSchema } from './address.schema';
import { AddressService } from './address.service';
import { AddressReversePipe } from './pipes/address-reverse.pipe';

@Module({
    imports: [MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }])],
    providers: [AddressService, AddressReversePipe],
    exports: [AddressService, AddressReversePipe],
})
export class AddressModule {}
