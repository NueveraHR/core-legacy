import { Injectable } from "@nestjs/common";
import { MulterOptionsFactory, MulterModuleOptions } from "@nestjs/platform-express";
import * as Multer from 'multer';
import * as Path from 'path';
import * as Fs from 'fs';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: Multer.diskStorage({
                destination: function (req, file, cb) {
                    const folderUploadPath = Path.join(__dirname, 'upload', req.user.id)
                    if (!Fs.existsSync(folderUploadPath)) {
                        Fs.mkdirSync(folderUploadPath, { recursive: true });
                    }
                    cb(null, folderUploadPath)

                },
                filename: function (req, file, cb) {
                    cb(null, Date.now() + '-' + file.originalname);
                }
            }),
        };
    }
}
