import { DocumentDto } from '@hrms-core/document/document.dto';
import { Injectable, Inject, HttpService } from '@nestjs/common';
import { ErrorService } from '@hrms-core/common/error/error.service';
import { Errors } from '@hrms-core/common/error/error.const';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { Document } from './document.schema';
import * as Fs from 'fs';
import * as Path from 'path';
import * as FormData from 'form-data';
import { EnvService } from '@libs/env';
import { FileData } from '@hrms-core/common/interfaces/file.interface';

const uploadDir = __dirname + '/../upload';

@Injectable()
export class DocumentMangmentService {
    @Inject(ErrorService) errorService: ErrorService;

    constructor(
        @InjectModel(Document.name)
        private readonly docuemntModel: PaginateModel<Document>,
        private readonly envService: EnvService,
        private httpService: HttpService,
    ) {}

    async save(fileData: FileData, userId?: string): Promise<Document> {
        return new Promise(async (resolve, reject) => {
            const { name, description } = fileData;
            const filePath = await this.saveOnDisk(fileData, userId);

            const document = new this.docuemntModel({
                name: name,
                fullPath: filePath,
                path: Path.relative(process.cwd(), filePath),
                description: description,
                type: fileData.mimetype,
            });

            resolve(
                await document.save().catch(err => {
                    return Promise.reject(
                        this.errorService.generate(Errors.General.INTERNAL_ERROR, {
                            detailedMessage: err,
                        }),
                    );
                }),
            );
        });
    }

    private async saveOnDisk(fileData: FileData, userId: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const fileUpload = await fileData;
            const fileStream = fileData.content;
            const userUploadDir = Path.join(uploadDir, userId);
            const fileName = new Date().getTime() + '-' + fileUpload.name;
            const filePath = Path.join(userUploadDir, fileName);

            if (!Fs.existsSync(userUploadDir)) {
                Fs.mkdirSync(userUploadDir, { recursive: true });
            }

            fileStream
                .pipe(Fs.createWriteStream(filePath))
                .on('finish', () => resolve(filePath))
                .on('error', () => reject());
        });
    }

    async uploadToImgpush(file: FileData): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const imgpushUrl = this.envService.read().IMGPUSH_URL;

            const formData = new FormData();
            formData.append('file', file.content, 'randomName');

            await this.httpService.axiosRef
                .post(imgpushUrl, formData, {
                    headers: formData.getHeaders(),
                })
                .then(res => resolve(res.data.filename))
                .catch(err => reject(err));
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

    findAllPaginated(
        page = 1,
        limit = 10,
        filterOptions = {},
    ): Promise<PaginateResult<Document>> {
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
        newDocument.description = documentDto.description
            ? documentDto.description
            : newDocument.description;
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
            .deleteOne({ fullPath: filePath })
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
