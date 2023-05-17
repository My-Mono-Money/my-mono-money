import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { SendEmailService } from '../send-email/send-email.service';
import { confirmEmailTemplate } from '../send-email/templates/confirm-email.email-template';
import { GenerateJwtService } from './jwt/generate-jwt.service';
import { UnverifiedEmailError } from 'src/common/errors/verified-email.error';

@Injectable()
export class ResendVerificationEmailService {
  constructor(
    private userStorage: UserStorage,
    private sendEmailService: SendEmailService,
    private generateJwtService: GenerateJwtService,
    private configService: ConfigService,
  ) {}

  async resendEmail(email: string) {
    const user = await this.userStorage.getByEmail(email);
    if (user.isEmailVerified) {
      throw new UnverifiedEmailError();
    }
    const verifyEmailToken = await this.generateJwtService.generateVerifyEmail(
      user,
    );
    const frontendUrl = this.configService.get('app.frontendUrl');

    return await this.sendEmailService.sendEmail(
      confirmEmailTemplate({ user, verifyEmailToken, frontendUrl }),
    );
  }
}
