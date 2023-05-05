import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IntegrationsModule } from '../integrations/integrations.module';
import { TokenService } from '../storage/services/token.service';
import { StorageModule } from '../storage/storage.module';
import { HashPasswordService } from './authentication/hashing/hash-password.service';
import { GenerateJwtService } from './authentication/jwt/generate-jwt.service';
import { JwtAuthGuard } from './authentication/jwt/jwt-auth.guard';
import { JwtStrategy } from './authentication/jwt/jwt.strategy';
import { SignInService } from './authentication/sign-in.service';
import { SignUpService } from './authentication/sign-up.service';
import { VerifyEmailService } from './authentication/verify-email.service';
import { DebugAccessGuard } from './debug/debug-access.guard';
import { SendTestEmailService } from './debug/send-test-email.service';
import { SendEmailService } from './send-email/send-email.service';
import { GetFilteredStatementService } from './statement/get-filtered-statement.service';
import { GetMonobankStatementService } from './statement/get-monobank-statement.service';
import { SaveTokenService } from './tokens/save-token.service';
import { ResendVerificationEmailService } from './authentication/resend-email.service';
import { IsEmailVerifiedGuard } from './authentication/verify-email.guard';
import { MonobankWebHookService } from './webhook/monobank-webhook.service';
import { InviteMemberService } from './space/invite-member/invite-member.service';
import { GetSpacesService } from './space/get-spaces/get-spaces.service';
import { GetSpaceMembersService } from './space/get-members/get-members.service';
@Module({
  imports: [
    StorageModule,
    ConfigModule,
    IntegrationsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('auth');
      },
    }),
  ],
  providers: [
    SignUpService,
    SignInService,
    JwtAuthGuard,
    IsEmailVerifiedGuard,
    TokenService,
    JwtStrategy,
    SendEmailService,
    ResendVerificationEmailService,
    GenerateJwtService,
    HashPasswordService,
    VerifyEmailService,
    MonobankWebHookService,
    SaveTokenService,
    SendTestEmailService,
    DebugAccessGuard,
    GetSpacesService,
    InviteMemberService,
    GetSpaceMembersService,
    GetMonobankStatementService,
    GetFilteredStatementService,
  ],
  exports: [
    SignUpService,
    SendEmailService,
    VerifyEmailService,
    SignInService,
    MonobankWebHookService,
    SaveTokenService,
    SendTestEmailService,
    TokenService,
    GetSpacesService,
    DebugAccessGuard,
    IsEmailVerifiedGuard,
    InviteMemberService,
    GetSpaceMembersService,
    GetMonobankStatementService,
    GetFilteredStatementService,
    ResendVerificationEmailService,
  ],
})
export class FunctionalityModule {}
