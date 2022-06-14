import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { IntegrationsModule } from '../integrations/integrations.module';
import { StorageModule } from '../storage/storage.module';
import { HashPasswordService } from './authentication/hashing/hash-password.service';
import { GenerateJwtService } from './authentication/jwt/generate-jwt.service';
import { JwtAuthGuard } from './authentication/jwt/jwt-auth.guard';
import { JwtStrategy } from './authentication/jwt/jwt.strategy';
import { SignInService } from './authentication/sign-in.service';
import { SignUpService } from './authentication/sign-up.service';
import { VerifyEmailService } from './authentication/verify-email.service';
import { SendEmailService } from './send-email/send-email.service';

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
    JwtStrategy,
    SendEmailService,
    GenerateJwtService,
    HashPasswordService,
    VerifyEmailService,
  ],
  exports: [SignUpService, SendEmailService, VerifyEmailService, SignInService],
})
export class FunctionalityModule {}
