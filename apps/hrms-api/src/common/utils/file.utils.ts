import { FileData } from '@hrms-core/common/interfaces/file.interface';
import { FileUpload } from 'graphql-upload';

export class FileUtils {
    static fromUpload(file: FileUpload): FileData {
        return {
            name: file.filename,
            mimetype: file.mimetype,
            encoding: file.encoding,
            content: file.createReadStream(),
            description: null,
        };
    }
}
