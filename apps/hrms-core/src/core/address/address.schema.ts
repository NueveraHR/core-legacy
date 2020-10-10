import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {
    @Prop()
    addressLine1: string;

    @Prop()
    addressLine2: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    country: string;

    @Prop()
    postalCode: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
