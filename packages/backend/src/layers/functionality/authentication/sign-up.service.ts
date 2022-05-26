import { Injectable } from '@nestjs/common';
import { UserService } from 'src/layers/storage/services/user.service';
import { SendEmailService } from '../send-email/send-email.service';
import { confirmEmailTemplate } from '../send-email/templates/confirm-email.email-template';
import { IUserSignUp } from './interfaces/user-signup-dto.interface';
import { GenerateJwtService } from './jwt/generate-jwt.service';

@Injectable()
export class SignUpService {
  constructor(
    private userService: UserService,
    private sendEmailService: SendEmailService,
    private generateJwtService: GenerateJwtService,
  ) {}

  async signUp(user: IUserSignUp) {
    /**
     * Instead of this we need to do real hash
     */
    const passwordHash = user.password;
    const verifyEmailToken = await this.generateJwtService.generateVerifyEmail(
      user,
    );

    return await this.userService.save(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash,
      },
      {
        afterSave: async () => {
          await this.sendEmailService.sendEmail(
            confirmEmailTemplate({ user, verifyEmailToken }),
          );
        },
      },
    );
  }
}
