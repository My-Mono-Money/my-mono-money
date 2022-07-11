import { Module } from '@nestjs/common';
import { FunctionalityModule } from '../functionality/functionality.module';
import { SignInController } from './authentication/sign-in/sign-in.controller';
import { SignUpController } from './authentication/sign-up/sign-up.controller';
import { VerifyEmailController } from './authentication/verify-email/verify-email.controller';
import { SaveTokenController } from './tokens/save-token/save-token.controller';

@Module({
  imports: [FunctionalityModule],
  controllers: [
    SignInController,
    SignUpController,
    VerifyEmailController,
    SaveTokenController,
  ],
})
export class ApiModule {}
