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
import { GetSpacesController } from './space/get-spaces/get-spaces.controller';
import { GetSpaceMembersController } from './space/get-members/get-members.controller';
import { AcceptInviteController } from './invites/accept-invite/accept-invite.controller';
import { GetUserController } from './user/get-user.controller';
import { RemoveMemberController } from './space/remove-member.controller.ts/remove-member.controller';
import { ChangeDefaultUserSpaceController } from './space/change-default-user-space/change-defalut-user-space.controller';
import { RetryImportController } from './tokens/retry-import/retry-import.controller';
import { GetImportAttemptController } from './tokens/get-import-attempt-log/get-import-attempt.controller';
import { RejectInviteController } from './invites/reject-invite/reject-invite.controller';
import { DeleteTokenController } from './tokens/delete-token/delete-token.controller';

@Module({
  imports: [FunctionalityModule, ConfigModule],
  controllers: [
    SignInController,
    SignUpController,
    GetUserController,
    GetTokenController,
    GetSpacesController,
    SaveTokenController,
    VerifyEmailController,
    AcceptInviteController,
    RejectInviteController,
    InviteMemberController,
    GetSpaceMembersController,
    GetImportAttemptController,
    SendTestEmailController,
    MonobankWebHookController,
    GetFilteredStatementController,
    ResendVerificationEmailController,
    RemoveMemberController,
    ChangeDefaultUserSpaceController,
    RetryImportController,
    DeleteTokenController,
  ],
})
export class ApiLayerModule {}
