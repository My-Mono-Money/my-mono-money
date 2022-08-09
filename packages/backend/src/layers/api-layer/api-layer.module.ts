import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FunctionalityModule } from '../functionality/functionality.module';
import { SignInController } from './authentication/sign-in/sign-in.controller';
import { SignUpController } from './authentication/sign-up/sign-up.controller';
import { VerifyEmailController } from './authentication/verify-email/verify-email.controller';
import { SendTestEmailController } from './debug/send-test-email.controller';
import { GetFilteredStatementController } from './statement/get-filtered-statement.controller';
import { SaveTokenController } from './tokens/save-token/save-token.controller';

@Module({
  imports: [FunctionalityModule, ConfigModule],
  controllers: [
    SignInController,
    SignUpController,
    VerifyEmailController,
    SaveTokenController,
    SendTestEmailController,
    GetFilteredStatementController,
  ],
})
export class ApiLayerModule {}
