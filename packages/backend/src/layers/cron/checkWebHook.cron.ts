import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QueueIntegration } from '~/integration/queue/queue.integration';

@Injectable()
export class CheckWebHookCron {
  constructor(private queueIntegration: QueueIntegration) {}
  private readonly logger = new Logger(CheckWebHookCron.name);

  @Cron(CronExpression.EVERY_5_MINUTES) //EVERY_DAY_AT_1AM for job. EVERY_MINUTE for testing
  async handleCron() {
    this.logger.debug('Called every 5 min');
    await this.queueIntegration.addToQueueCheckWebhook();
  }
}
