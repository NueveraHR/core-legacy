import { EnvService } from '@libs/env';
import { LoggerService } from '@libs/logger';
import { Inject, Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';
import path from 'path';
import * as hbs from 'nodemailer-express-handlebars';

@Injectable()
export class MailerService {
    @Inject() loggerService: LoggerService;

    private transporter: Mail;

    constructor(envService: EnvService) {}

    init(): void {
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
                partialsDir: path.join('./assets/templates/'),
                layoutsDir: path.join('./assets/templates/'),
                defaultLayout: '',
            },
            viewPath: path.join('./assets/templates/'),
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

    send(mail: any) {
        if (!this.transporter) {
            this.init();
        }

        return this.transporter.sendMail(mail).catch(e => console.log(e));
    }
}
