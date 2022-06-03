import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { UserService } from 'src/layers/storage/services/user.service';

@Injectable()
export class VerifyEmailService {
  constructor(private userService: UserService) {}

  async verifyEmail(email: string) {
    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new NotFoundError();
    }

    await this.userService.updateByEmail(email, { isEmailVerified: true });
  }
}
