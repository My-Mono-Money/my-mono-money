import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SendinblueIntegration } from './sendinblue/sendinblue.integration';
import { MonobankIntegration } from './monobank/monobank.integration';
import { BullModule } from '@nestjs/bull';
import { QueueIntegration } from './queue/queue.integration';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'statement' },
      { name: 'webhook' },
    ),
    ConfigModule,
    HttpModule,
  ],
  providers: [SendinblueIntegration, MonobankIntegration, QueueIntegration],
  exports: [SendinblueIntegration, MonobankIntegration, QueueIntegration],
})
export class IntegrationsModule {}
