import { ErrorService } from '@hrms-core/common/error/error.service';
import { Inject, Injectable } from '@nestjs/common';
import { Address } from './address.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddressDto } from '@hrms-core/dto/address.dto';
import { Errors } from '@hrms-core/common/error/error.const';

@Injectable()
export class AddressService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(@InjectModel(Address.name) private readonly addressModel: Model<Address>) {}

    create(addressDto: AddressDto): Promise<Address> {
        return new this.addressModel(addressDto).save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    update(address: Address): Promise<Address> {
        return address.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    // NOTE: We don't provide a findById nor a delete service because :
    // 1) Address is directly associated to user so no need for a find (we use populate instead).
    // 2) Address should not be deleted because we can't delete user neither.
}
