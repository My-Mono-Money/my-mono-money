import { Injectable } from '@nestjs/common';
import { UserService } from 'src/layers/storage/services/user.service';
import { SendEmailService } from '../send-email/send-email.service';
import { IUserSignUp } from './interfaces/user-signup-dto.interface';

@Injectable()
export class SignUpService {
  constructor(
    private userService: UserService,
    private sendEmailService: SendEmailService,
  ) {}

  async signUp(user: IUserSignUp) {
    /**
     * Instead of this we need to do real hash
     */
    const passwordHash = user.password;

    return await this.userService.save(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        passwordHash,
      },
      {
        transactionCallback: async () => {
          await this.sendEmailService.sendEmail({
            to: {
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
            },
            subject: 'Confirm your email address',
            content:
              'Please, follow the <a href="https://my-mono-money.app/">link</a> to confirm email',
          });
        },
      },
    );
  }
}
