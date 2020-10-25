import { DocumentDto } from '@hrms-core/document/document.dto';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetDocument implements Partial<DocumentDto> {
    @Field(() => ID)
    public id?: string;

    @Field()
    public name: string;

    @Field({ nullable: true })
    public description: string;

    @Field()
    public path: string;

    @Field()
    public type: string;
}

@ObjectType()
export class UploadDocument extends GetDocument {}

@ObjectType()
export class UploadProfileImage {
    @Field()
    public imagePath: string;
}

@ObjectType()
export class DeleteFileResult {
    @Field()
    public success: boolean;
}
