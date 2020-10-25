import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document as MongoDocument } from 'mongoose';
import { Document } from '@hrms-core/document/document.schema';

@Schema()
export class Education extends MongoDocument {
    @Prop({ required: true })
    school: string;

    @Prop({ required: true })
    degree: string;

    @Prop()
    field: string;

    @Prop()
    startYear: Date;

    @Prop()
    endYear: Date;

    @Prop()
    description: string;

    @Prop({ ref: 'Document', type: SchemaTypes.ObjectId })
    document?: Document;
}

export const EducationSchema = SchemaFactory.createForClass(Education);
