import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';
import { GetStatementConsumer } from './getStatement.consumer';
import { SendTestEmailConsumer } from './sendTestEmail.consumer';

@Module({
  imports: [FunctionalityModule],
  exports: [SendTestEmailConsumer, GetStatementConsumer],
  providers: [SendTestEmailConsumer, GetStatementConsumer],
})
export class WorkerLayerModule {}
