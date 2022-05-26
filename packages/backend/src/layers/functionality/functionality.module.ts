import { Module } from '@nestjs/common';
import { IntegrationsModule } from '../integrations/integrations.module';
import { StorageModule } from '../storage/storage.module';
import { SignUpService } from './authentication/sign-up.service';
import { SendEmailService } from './send-email/send-email.service';

@Module({
  imports: [StorageModule, IntegrationsModule],
  providers: [SignUpService, SendEmailService],
  exports: [SignUpService, SendEmailService],
})
export class FunctionalityModule {}
