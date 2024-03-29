import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';

interface ISendTestEmailOptions {
  email: string;
}

interface IGetStatementOptions {
  tokenId: string;
  importAttemptId: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class QueueIntegration {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('statement') private readonly statementQueue: Queue,
    @InjectQueue('webhook') private readonly webHookQueue: Queue,
  ) {}

  async addToQueue({ email }: ISendTestEmailOptions) {
    await this.emailQueue.add({ email });
  }

  async addToQueueStatement({
    tokenId,
    importAttemptId,
    spaceOwnerEmail,
  }: IGetStatementOptions) {
    Logger.log(
      `Added to queue: ${tokenId}`,
      'WebApp',
      `${importAttemptId}`,
      'spaceOwnerEmail',
      `${spaceOwnerEmail}`,
    );
    await this.statementQueue.add({
      tokenId,
      importAttemptId,
      spaceOwnerEmail,
    });
  }
  async addToQueueCheckWebhook() {
    Logger.log(`Added to queue check webhook`);
    await this.webHookQueue.add({});
  }
}
