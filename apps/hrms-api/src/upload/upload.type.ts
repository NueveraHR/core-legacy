import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GetDocument {
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
