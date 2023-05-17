import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { SignInService } from './sign-in.service';

@Injectable()
export class VerifyEmailService {
  constructor(
    private userStorage: UserStorage,
    private signInService: SignInService,
  ) {}

  async verifyEmail(email: string) {
    const user = await this.userStorage.getByEmail(email);

    if (!user) {
      throw new NotFoundError();
    }

    await this.userStorage.updateByEmail(email, { isEmailVerified: true });
    return await this.signInService.signInByEmail(email);
  }
}
