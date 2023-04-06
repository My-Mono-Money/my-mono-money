import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FunctionalityModule } from '../functionality/functionality.module';
import { SignInController } from './authentication/sign-in/sign-in.controller';
import { SignUpController } from './authentication/sign-up/sign-up.controller';
import { VerifyEmailController } from './authentication/verify-email/verify-email.controller';
import { ResendEmailController } from './authentication/resend-email/resend-email.controller';
import { SendTestEmailController } from './debug/send-test-email.controller';
import { GetFilteredStatementController } from './statement/get-filtered-statement.controller';
import { GetTokenController } from './tokens/get-token/get-token.controller';
import { SaveTokenController } from './tokens/save-token/save-token.controller';

@Module({
  imports: [FunctionalityModule, ConfigModule],
  controllers: [
    SignInController,
    SignUpController,
    GetTokenController,
    SaveTokenController,
    VerifyEmailController,
    SendTestEmailController,
    GetFilteredStatementController,
    ResendEmailController,
  ],
})
export class ApiLayerModule {}
