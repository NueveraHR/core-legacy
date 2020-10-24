import { ReadStream } from 'fs';

export interface FileData {
    content: ReadStream;
    mimetype?: string;
    encoding?: string;

    name?: string;
    description?: string;
}
