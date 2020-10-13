import { AddressDto } from '@hrms-core/address/address.dto';

export const ADDRESS_MOCK: { [id: string]: AddressDto } = {
    basic: {
        addressLine1: 'Address line 1 test',
        city: 'El Kadhra',
        state: 'Tunis',
        country: 'Tunisia',
        postalCode: '2282',
    },
};
