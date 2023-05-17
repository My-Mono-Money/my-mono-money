import { Injectable } from '@nestjs/common';
import { SendinblueIntegration } from 'src/layers/integration/sendinblue/sendinblue.integration';

interface ISendEmailOptions {
  to: {
    name: string;
    email: string;
  };
  subject: string;
  content: string;
}

@Injectable()
export class SendEmailService {
  constructor(private sendinblueIntegration: SendinblueIntegration) {}

  async sendEmail({ to, subject, content }: ISendEmailOptions) {
    await this.sendinblueIntegration.sendTransactionalEmail({
      to,
      subject,
      content,
    });
  }
}
