import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SendinblueService } from './sendinblue/sendinblue.service';
import { MonobankService } from './monobank/monobank.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SendinblueService, MonobankService],
  exports: [SendinblueService, MonobankService],
})
export class IntegrationsModule {}
