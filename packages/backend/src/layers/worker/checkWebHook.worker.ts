import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MonobankWebHookService } from '~/functionality/webhook/monobank-webhook.service';

@Processor('webhook')
export class CheckWebHookWorker {
  constructor(private monobankWebHookService: MonobankWebHookService) {}
  @Process({
    concurrency: 1,
  })
  async readOperationJob(job: Job) {
    Logger.log(`Worker started check webhook`, 'Worker');
    await this.monobankWebHookService.checkWebHook(job.data);
  }
}
