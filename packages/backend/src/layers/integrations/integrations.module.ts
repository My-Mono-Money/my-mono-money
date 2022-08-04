import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SendinblueService } from './sendinblue/sendinblue.service';
import { MonobankService } from './monobank/monobank.service';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue/queue.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email',
      },
      { name: 'statement' },
    ),
    ConfigModule,
    HttpModule,
  ],
  providers: [SendinblueService, MonobankService, QueueService],
  exports: [SendinblueService, MonobankService, QueueService],
})
export class IntegrationsModule {}
