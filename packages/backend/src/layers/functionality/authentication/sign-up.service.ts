import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/layers/storage/services/user.service';
import { SendEmailService } from '../send-email/send-email.service';
import { confirmEmailTemplate } from '../send-email/templates/confirm-email.email-template';
import { HashPasswordService } from './hashing/hash-password.service';
import { IUserSignUp } from './interfaces/user-signup-dto.interface';
import { GenerateJwtService } from './jwt/generate-jwt.service';

@Injectable()
export class SignUpService {
  constructor(
    private userService: UserService,
    private sendEmailService: SendEmailService,
    private generateJwtService: GenerateJwtService,
    private hashPasswordService: HashPasswordService,
    private configService: ConfigService,
  ) {}

  async signUp(user: IUserSignUp) {
    const passwordHash = await this.hashPasswordService.hashPassword({
      password: user.password,
    });

    const verifyEmailToken = await this.generateJwtService.generateVerifyEmail(
      user,
    );
    const frontendUrl = this.configService.get('app.frontendUrl');

    return await this.userService.save(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash,
        isEmailVerified: false,
      },
      {
        afterSave: async () => {
          await this.sendEmailService.sendEmail(
            confirmEmailTemplate({ user, verifyEmailToken, frontendUrl }),
          );
        },
      },
    );
  }
}
