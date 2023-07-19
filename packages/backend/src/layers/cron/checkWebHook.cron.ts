import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueIntegration } from '~/integration/queue/queue.integration';

@Injectable()
export class CheckWebHookCron {
  constructor(private queueIntegration: QueueIntegration) {}
  private readonly logger = new Logger(CheckWebHookCron.name);

  @Cron(CronExpression.EVERY_DAY_AT_1AM) //EVERY_DAY_AT_1AM for job. EVERY_MINUTE for testing
  async handleCron() {
    this.logger.debug('Called every 1 day');
    await this.queueIntegration.addToQueueCheckWebhook();
  }
}
