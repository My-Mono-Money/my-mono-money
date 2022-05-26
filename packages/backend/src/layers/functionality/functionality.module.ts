import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IntegrationsModule } from '../integrations/integrations.module';
import { StorageModule } from '../storage/storage.module';
import { SignUpService } from './authentication/sign-up.service';
import { SendEmailService } from './send-email/send-email.service';

@Module({
  imports: [
    StorageModule,
    IntegrationsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('auth');
      },
    }),
  ],
  providers: [SignUpService, SendEmailService],
  exports: [SignUpService, SendEmailService],
})
export class FunctionalityModule {}
