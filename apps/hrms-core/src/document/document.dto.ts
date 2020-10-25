import { PaginateResult } from 'mongoose';

export class DocumentDto {
    id?: string;
    name?: string;
    description?: string;
    path?: string;
    fullPath?: string;
    type?: string;
}

export type DocumentPaginateDto = PaginateResult<DocumentDto>;
