import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ISendEmailOptions {
  to: {
    name: string;
    email: string;
  };
  subject: string;
  content: string;
}

@Injectable()
export class SendinblueService {
  constructor(
    private httpSevice: HttpService,
    private configService: ConfigService,
  ) {}

  async sendTransactionalEmail({ to, subject, content }: ISendEmailOptions) {
    await this.httpSevice
      .post(
        'https://api.sendinblue.com/v3/smtp/email',
        {
          sender: {
            name: this.configService.get('sendinblue.senderName'),
            email: this.configService.get('sendinblue.senderEmail'),
          },
          to: [to],
          subject,
          htmlContent: `<html><head></head><body><p>${content}</p></body></html>`,
        },
        {
          headers: {
            'api-key': this.configService.get('sendinblue.apiKey'),
          },
        },
      )
      .toPromise();
  }
}
