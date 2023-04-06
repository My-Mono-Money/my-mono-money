import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/layers/storage/services/user.service';
import { SendEmailService } from '../send-email/send-email.service';
import { confirmEmailTemplate } from '../send-email/templates/confirm-email.email-template';
import { GenerateJwtService } from './jwt/generate-jwt.service';
import { NotFoundError } from 'src/common/errors/not-found.error';

@Injectable()
export class ResendEmailService {
  constructor(
    private userService: UserService,
    private sendEmailService: SendEmailService,
    private generateJwtService: GenerateJwtService,
    private configService: ConfigService,
  ) {}

  async resendEmail(email: string) {
    const user = await this.userService.getByEmail(email);
    const verifyEmailToken = await this.generateJwtService.generateVerifyEmail(
      user,
    );
    const frontendUrl = this.configService.get('app.frontendUrl');

    return await this.sendEmailService.sendEmail(
      confirmEmailTemplate({ user, verifyEmailToken, frontendUrl }),
    );
  }
}
