import { DocumentDto } from '@hrms-core/dto/document.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { Document } from './document.schema';
import { MulterFile } from './multerFile.interface';
import * as Fs from 'fs';

@Injectable()
export class DocumentMangmentService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        @InjectModel(Document.name)
        private readonly docuemntModel: PaginateModel<Document>,
    ) {}

    create(documentDto: DocumentDto, userId: string, file: MulterFile): Promise<Document> {
        const document = new this.docuemntModel({
            ...documentDto,
            user: userId,
            file: file,
        });

        return document.save().catch(err => {
            return Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            );
        });
    }

    findAll(): Promise<Document[]> {
        return this.docuemntModel
            .find()
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    findAllPaginated(page = 1, limit = 10, filterOptions = {}): Promise<PaginateResult<Document>> {
        const options = {
            page: page,
            limit: limit,
        };

        return this.docuemntModel.paginate(filterOptions, options).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    findById(id: string): Promise<Document> {
        return this.docuemntModel
            .findById(id)
            .exec()
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }

    async update(id: string, documentDto: DocumentDto): Promise<Document> {
        const newDocument = await this.findById(id);
        newDocument.name = documentDto.name;
        newDocument.type = documentDto.type;
        newDocument.description = documentDto.description;
        return newDocument.save().catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
    }

    async delete(id: string): Promise<boolean> {
        let foundDocument: Document;
        await this.findById(id)
            .then(result => (foundDocument = result))
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );

        return this.deleteByPath(foundDocument.file.path);
    }

    async deleteByPath(filePath: string): Promise<boolean> {
        await Fs.promises.unlink(filePath).catch(err =>
            Promise.reject(
                this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                    detailedMessage: err,
                }),
            ),
        );
        return this.docuemntModel
            .deleteOne({ 'file.path': filePath })
            .exec()
            .then(result => result.deletedCount == 1)
            .catch(err =>
                Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                ),
            );
    }
}
