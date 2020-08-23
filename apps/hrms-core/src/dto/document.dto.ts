import { PaginateResult } from 'mongoose';

export class DocumentDto {
    constructor(public id?: string, public name?: string, public type?: string, public description?: string) {}
}

export type DocumentPaginateDto = PaginateResult<DocumentDto>;
