import { Module } from '@nestjs/common';
import { CheckWebHookCron } from './checkWebHook.cron';
import { IntegrationsModule } from '~/integration/integrations.module';

@Module({
  imports: [IntegrationsModule],
  exports: [CheckWebHookCron],
  providers: [CheckWebHookCron],
})
export class CronLayerModule {}
