import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

interface ISendTestEmailOptions {
  email: string;
}

@Injectable()
export class QueueService {
  constructor(@InjectQueue('email') private readonly emailQueue: Queue) {}

  async addToQueue({ email }: ISendTestEmailOptions) {
    await this.emailQueue.add({ email });
  }
}
