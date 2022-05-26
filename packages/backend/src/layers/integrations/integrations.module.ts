import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SendinblueService } from './sendinblue/sendinblue.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SendinblueService],
  exports: [SendinblueService],
})
export class IntegrationsModule {}
