import { DtoTransformPipe } from '@hrms-core/common/interfaces/dto-pipe-transform';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { Address } from '../address.schema';

export class AddressReversePipe implements DtoTransformPipe<AddressDto, Address> {
    transform(addressDto: AddressDto, options?: object): Address {
        const address = new Address();
        return this.transformExistent(addressDto, address, options);
    }

    transformExistent(dto: AddressDto, address: Address, options?: object): Address {
        address.addressLine1 = dto.addressLine1 ?? address.addressLine1;
        address.addressLine2 = dto.addressLine2 ?? address.addressLine2;
        address.city = dto.city ?? address.city;
        address.state = dto.state ?? address.state;
        address.country = dto.country ?? address.country;
        address.postalCode = dto.postalCode ?? address.postalCode;

        return address;
    }

    canTransform(value: AddressDto): boolean {
        return true;
    }
}
