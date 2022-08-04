import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface ISendTestEmailOptions {
  email: string;
}

interface IGetStatementOptions {
  tokenId: string;
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue,
    @InjectQueue('statement') private readonly statementQueue: Queue,
  ) {}

  async addToQueue({ email }: ISendTestEmailOptions) {
    await this.emailQueue.add({ email });
  }

  async addToQueueStatement({ tokenId }: IGetStatementOptions) {
    await this.statementQueue.add({ tokenId });
  }
}
