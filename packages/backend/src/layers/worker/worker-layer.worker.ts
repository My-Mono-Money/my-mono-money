import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';
import { GetStatementWorker } from './getStatement.worker';
import { SendTestEmailWorker } from './sendTestEmail.worker';
import { CheckWebHookWorker } from './checkWebHook.worker';

@Module({
  imports: [FunctionalityModule],
  exports: [SendTestEmailWorker, GetStatementWorker, CheckWebHookWorker],
  providers: [SendTestEmailWorker, GetStatementWorker, CheckWebHookWorker],
})
export class WorkerLayerModule {}
