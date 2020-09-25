import { Args, Mutation, Resolver, Query, ID } from '@nestjs/graphql';

import { GraphQLUpload } from 'apollo-server-core';
import { FileUpload } from 'graphql-upload';

import { JwtAuthGuard } from '@hrms-api/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/currentUser.decorator';
import { DocumentMangmentService } from '@hrms-core/core/document/document-mangment.service';
import { UserDto } from '@hrms-core/dto/user.dto';
import { UploadDocument, DeleteFileResult, GetDocument, UploadProfileImage } from './upload.type';
import { DocumentDto } from '@hrms-core/dto/document.dto';
import { UserService } from '@hrms-core/core/user/user.service';

@UseGuards(JwtAuthGuard)
@Resolver()
export class UploadResolver {
    constructor(
        private readonly documentMangmentService: DocumentMangmentService,
        protected userService: UserService,
    ) {}

    @Query(() => GetDocument)
    async getDocument(@Args('id', { type: () => String }) id: string): Promise<GetDocument> {
        return this.documentMangmentService.findById(id);
    }

    @Mutation(() => UploadDocument)
    public async uploadDocument(
        @CurrentUser() currentUser: UserDto,
        @Args('name', { type: () => String }) name: string,
        @Args('description', { type: () => String }) description: string,
        @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    ): Promise<UploadDocument> {
        const fileData = {
            description,
            name,
            userId: currentUser.id,
        };
        const savedFile = await this.documentMangmentService.save(file, fileData);
        return {
            description: savedFile.description,
            id: savedFile.id,
            name: savedFile.name,
            path: savedFile.path,
            type: savedFile.type,
        };
    }

    @Mutation(() => UploadProfileImage)
    public async uploadProfileImage(
        @Args('employeeId', { type: () => ID }) employeeId: string,
        @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
    ): Promise<UploadProfileImage> {
        const imgPath = await this.documentMangmentService.uploadToImgpush(file);
        await this.userService.updatePicture(employeeId, imgPath);

        return {
            imagePath: imgPath,
        };
    }

    @Mutation(() => UploadDocument)
    public async updateDocument(
        @Args('id', { type: () => String }) id: string,
        @Args('name', { type: () => String, nullable: true }) name: string,
        @Args('description', { type: () => String, nullable: true }) description: string,
    ): Promise<UploadDocument> {
        const fileData: DocumentDto = {
            id,
            name,
            description,
        };
        const savedFile = await this.documentMangmentService.update(fileData);
        return {
            description: savedFile.description,
            id: savedFile.id,
            name: savedFile.name,
            path: savedFile.path,
            type: savedFile.type,
        };
    }

    @Mutation(() => DeleteFileResult)
    public async deleteDocument(@Args('id', { type: () => String }) id: string): Promise<DeleteFileResult> {
        return { success: await this.documentMangmentService.delete(id) };
    }
}
