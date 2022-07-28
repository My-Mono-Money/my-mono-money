import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/layers/integrations/queue/queue.service';
import { SendEmailService } from '../send-email/send-email.service';
import { testEmailTemplate } from '../send-email/templates/test-email.email-template';

interface ISendTestEmail {
  email: string;
}

@Injectable()
export class SendTestEmailService {
  constructor(
    private queueService: QueueService,
    private sendEmailService: SendEmailService,
  ) {}

  async addToQueue({ email }: ISendTestEmail) {
    await this.queueService.addToQueue({ email });
  }

  async sendTestEmail({ email }: ISendTestEmail) {
    await this.sendEmailService.sendEmail(testEmailTemplate({ email }));
  }
}
