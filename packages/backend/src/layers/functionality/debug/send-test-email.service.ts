import { Injectable } from '@nestjs/common';
import { QueueService } from 'src/layers/integrations/queue/queue.service';

interface ISendTestEmail {
  email: string;
}

@Injectable()
export class SendTestEmailService {
  constructor(private queueService: QueueService) {}

  async sendTestEmail({ email }: ISendTestEmail) {
    await this.queueService.addToQueue({ email });
  }
}
