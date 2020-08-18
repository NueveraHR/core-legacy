import * as  mongoose from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import * as mongoosePaginate from 'mongoose-paginate';
import { User } from "../user/user.schema";

@Schema()
export class Document extends mongoose.Document {
    @Prop()
    name: string;

    @Prop()
    type: string;

    @Prop()
    description: string;

    @Prop()
    file: string;

    @Prop({ ref: 'user', type: mongoose.Types.ObjectId })
    user: User;

}

export const DocumentSchema = SchemaFactory.createForClass(Document);

DocumentSchema.plugin(mongoosePaginate);