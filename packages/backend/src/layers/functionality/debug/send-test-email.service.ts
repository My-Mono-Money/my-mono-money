import { Injectable } from '@nestjs/common';
import { QueueIntegration } from 'src/layers/integration/queue/queue.integration';
import { SendEmailService } from '../send-email/send-email.service';
import { testEmailTemplate } from '../send-email/templates/test-email.email-template';

interface ISendTestEmail {
  email: string;
}

@Injectable()
export class SendTestEmailService {
  constructor(
    private queueIntegration: QueueIntegration,
    private sendEmailService: SendEmailService,
  ) {}

  async addToQueue({ email }: ISendTestEmail) {
    await this.queueIntegration.addToQueue({ email });
  }

  async sendTestEmail({ email }: ISendTestEmail) {
    await this.sendEmailService.sendEmail(testEmailTemplate({ email }));
  }
}
