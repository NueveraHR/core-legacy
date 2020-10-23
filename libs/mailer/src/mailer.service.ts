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

    constructor(private envService: EnvService) {}

    init(): void {
        const templatesDir = __dirname + '/templates/';
        const env = this.envService.read();
        const transporterConfig = {
            pool: true,
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
            auth: {
                user: env.SMTP_USER,
                pass: env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        };

        this.transporter = nodemailer.createTransport(transporterConfig as any);

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
    send(mail: any): Promise<any> {
        if (!this.transporter) {
            this.init();
        }

        return this.transporter
            .sendMail(mail)
            .catch(error => this.loggerService.error(error));
    }
}
