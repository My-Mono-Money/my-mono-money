import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';
import { GetStatementWorker } from './getStatement.worker';
import { SendTestEmailWorker } from './sendTestEmail.worker';

@Module({
  imports: [FunctionalityModule],
  exports: [SendTestEmailWorker, GetStatementWorker],
  providers: [SendTestEmailWorker, GetStatementWorker],
})
export class WorkerLayerModule {}
