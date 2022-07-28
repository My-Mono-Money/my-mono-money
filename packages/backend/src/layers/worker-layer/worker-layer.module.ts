import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';
import { SendTestEmailConsumer } from './sendTestEmail.consumer';

@Module({
  imports: [FunctionalityModule],
  exports: [SendTestEmailConsumer],
  providers: [SendTestEmailConsumer],
})
export class WorkerLayerModule {}
