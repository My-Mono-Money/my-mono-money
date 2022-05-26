import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/layers/storage/services/user.service';
import { SendEmailService } from '../send-email/send-email.service';
import { confirmEmailTemplate } from '../send-email/templates/confirm-email.email-template';
import { IUserSignUp } from './interfaces/user-signup-dto.interface';

@Injectable()
export class SignUpService {
  constructor(
    private userService: UserService,
    private sendEmailService: SendEmailService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: IUserSignUp) {
    /**
     * Instead of this we need to do real hash
     */
    const passwordHash = user.password;
    const accessToken = await this.generateJwtToken(user);

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
            confirmEmailTemplate({ user, accessToken }),
          );
        },
      },
    );
  }

  async generateJwtToken(user: IUserSignUp) {
    const payload = { userEmail: user.email };
    return this.jwtService.sign(payload);
  }
}
