import { EnvService } from '@libs/env';
import { LoggerService } from '@libs/logger';
import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import path from 'path';

@Injectable()
export class MailerService {
    @Inject() loggerService: LoggerService;

    private transporter: Mail;

    constructor(envService: EnvService) {}

    init(): void {
        const templatesDir = __dirname + '/templates/';
        this.transporter = nodemailer.createTransport({
            pool: true,
            host: 'ssl0.ovh.net',
            port: 25,
            secure: false,
            auth: {
                user: 'wbougarfa@nuevera.com',
                pass: 'Wael5121997',
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const hbsConfig = {
            viewEngine: {
                extName: '.hbs',
                partialsDir: templatesDir,
                layoutsDir: templatesDir,
                defaultLayout: '',
            },
            viewPath: templatesDir,
            extName: '.hbs',
        };

        this.transporter.use('compile', hbs(hbsConfig));
    }

    isConnected(): Promise<boolean> {
        return this.transporter.verify().catch(err => {
            this.loggerService.error('Cannot connect to transporter : ' + err);
            return false;
        });
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    send(mail: any): any {
        if (!this.transporter) {
            this.init();
        }

        return this.transporter.sendMail(mail).catch(e => console.log(e));
    }
}
