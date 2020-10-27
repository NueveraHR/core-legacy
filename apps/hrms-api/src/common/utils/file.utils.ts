import { FileData } from '@hrms-core/common/interfaces/file';
import { FileUpload } from 'graphql-upload';
import * as mime from 'mime-types';

export class FileUtils {
    static fromUpload(file: FileUpload): FileData {
        return {
            name: file.filename,
            extension: mime.extension(file.mimetype) || null,
            mimetype: file.mimetype,
            encoding: file.encoding,
            content: file.createReadStream(),
            description: null,
        };
    }
}
