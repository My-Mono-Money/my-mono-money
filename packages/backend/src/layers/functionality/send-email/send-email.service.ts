import { Injectable } from '@nestjs/common';
import { SendinblueService } from 'src/layers/integrations/sendinblue/sendinblue.service';

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
  constructor(private sendinblueService: SendinblueService) {}

  async sendEmail({ to, subject, content }: ISendEmailOptions) {
    await this.sendinblueService.sendTransactionalEmail({
      to,
      subject,
      content,
    });
  }
}
