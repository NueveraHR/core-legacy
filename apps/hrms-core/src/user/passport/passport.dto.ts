import { DocumentDto } from '@hrms-core/document/document.dto';

export class PassportDto {
    id?: string;
    number?: string;
    issueDate?: Date;
    document?: DocumentDto | string;
}
