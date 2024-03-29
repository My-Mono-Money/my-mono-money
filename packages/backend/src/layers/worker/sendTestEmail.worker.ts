import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendTestEmailService } from '../functionality/debug/send-test-email.service';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Processor('email')
export class SendTestEmailWorker {
  constructor(private sendTestEmailService: SendTestEmailService) {}
  @Process({
    concurrency: 1,
  })
  async readOperationJob(job: Job<{ email: string }>) {
    await delay(60000);
    await this.sendTestEmailService.sendTestEmail(job.data);
  }
}
