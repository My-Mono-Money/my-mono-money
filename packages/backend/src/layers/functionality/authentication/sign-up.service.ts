import { Injectable } from '@nestjs/common';
import { UserService } from 'src/layers/storage/services/user.service';
import { IUserSignUp } from './interfaces/user-signup-dto.interface';

@Injectable()
export class SignUpService {
  constructor(private userService: UserService) {}

  async signUp(user: IUserSignUp) {
    /**
     * Instead of this we need to do real hash
     */
    const passwordHash = user.password;

    await this.userService.save({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      passwordHash,
    });
  }
}
