import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UserService } from 'src/layers/storage/services/user.service';
import { SignInService } from './sign-in.service';
import { UnverifiedEmailError } from 'src/common/errors/verified-email.error';

@Injectable()
export class VerifyEmailService {
  constructor(
    private userService: UserService,
    private signInService: SignInService,
  ) {}

  async verifyEmail(email: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError();
    }

    await this.userService.updateByEmail(email, { isEmailVerified: true });
    return await this.signInService.signInByEmail(email);
  }

  async checkVerifyEmail(email: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError();
    }

    if (user && !user.isEmailVerified) {
      throw new UnverifiedEmailError();
    }

    return await this.signInService.signInByEmail(email);
  }
}
