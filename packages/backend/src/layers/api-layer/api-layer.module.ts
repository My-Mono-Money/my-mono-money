import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FunctionalityModule } from '../functionality/functionality.module';
import { SignInController } from './authentication/sign-in/sign-in.controller';
import { SignUpController } from './authentication/sign-up/sign-up.controller';
import { VerifyEmailController } from './authentication/verify-email/verify-email.controller';
import { ResendVerificationEmailController } from './authentication/resend-email/resend-verification-email.controller';
import { SendTestEmailController } from './debug/send-test-email.controller';
import { GetFilteredStatementController } from './statement/get-filtered-statement.controller';
import { GetTokenController } from './tokens/get-token/get-token.controller';
import { SaveTokenController } from './tokens/save-token/save-token.controller';
import { MonobankWebHookController } from './webhook/monobank-webhook.controller';
import { InviteMemberController } from './space/invite-member/invite-member.controller';
import { GetSpaceMembersController } from './space/get-members/get-members.controller';

@Module({
  imports: [FunctionalityModule, ConfigModule],
  controllers: [
    SignInController,
    SignUpController,
    GetTokenController,
    SaveTokenController,
    VerifyEmailController,
    InviteMemberController,
    GetSpaceMembersController,
    SendTestEmailController,
    MonobankWebHookController,
    GetFilteredStatementController,
    ResendVerificationEmailController,
  ],
})
export class ApiLayerModule {}
