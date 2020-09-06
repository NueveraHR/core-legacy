import { DocumentDto } from '@hrms-core/dto/document.dto';
import { Injectable, Inject } from '@nestjs/common';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { Document } from './document.schema';
import { FileUpload } from 'graphql-upload';
import * as Fs from 'fs';
import * as Path from 'path';

const uploadDir = __dirname + '/../../../upload';

interface FileData {
    name: string;
    userId: string;
    description: string;
}

@Injectable()
export class DocumentMangmentService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        @InjectModel(Document.name)
        private readonly docuemntModel: PaginateModel<Document>,
    ) { }

    async save(file: FileUpload, fileData: FileData): Promise<Document> {

        return new Promise(async (resolve, reject) => {
            const { name, userId, description } = fileData;
            const filePath = await this.saveOnDisk(file, userId)

            const document = new this.docuemntModel({
                name: name,
                fullPath: filePath,
                path: Path.relative(process.cwd(), filePath),
                description: description,
                type: file.mimetype,
                user: userId
            });

            resolve(await document.save().catch(err => {
                return Promise.reject(
                    this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                        detailedMessage: err,
                    }),
                );
            }));

        });
    }

    private async saveOnDisk(file: FileUpload, userId: string): Promise<string> {

        return new Promise(async (resolve, reject) => {
            const fileUpload = await file;
            const fileStream = fileUpload.createReadStream();
            const userUploadDir = Path.join(uploadDir, userId);
            const fileName = new Date().getTime() + '-' + fileUpload.filename;
            const filePath = Path.join(userUploadDir, fileName)

            if (!Fs.existsSync(userUploadDir)) {
                Fs.mkdirSync(userUploadDir);
            }

            fileStream
                .pipe(Fs.createWriteStream(filePath))
                .on("finish", () => resolve(filePath))
                .on("error", () => reject())
        })

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

    async update(documentDto: DocumentDto): Promise<Document> {
        const newDocument = await this.findById(documentDto.id);
        newDocument.name = documentDto.name ? documentDto.name : newDocument.name;
        newDocument.description = documentDto.description ? documentDto.description : newDocument.description;
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

        return this.deleteByPath(foundDocument.fullPath);
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
            .deleteOne({ 'fullPath': filePath })
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
