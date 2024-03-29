import { Injectable } from '@nestjs/common';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { HashPasswordService } from './hashing/hash-password.service';
import { GenerateJwtService } from './jwt/generate-jwt.service';
import { ISignInByEmailWithPassword } from './interfaces/signin-by-email-with-password-dto.interface';
import { UnauthorizedError } from 'src/common/errors/unauthorized.error';

@Injectable()
export class SignInService {
  constructor(
    private userStorage: UserStorage,
    private generateJwtService: GenerateJwtService,
    private hashPasswordService: HashPasswordService,
  ) {}

  async signInByEmailWithPassword(user: ISignInByEmailWithPassword) {
    const userByEmail = await this.userStorage.getByEmail(user.email);

    if (!userByEmail) {
      throw new UnauthorizedError();
    }

    const isPasswordCorrect = await this.hashPasswordService.comparePassword({
      password: user.password,
      hash: userByEmail.passwordHash,
    });

    if (!isPasswordCorrect) {
      throw new UnauthorizedError();
    }

    return await this.generateJwtService.generateAccessToken({
      id: userByEmail.id,
      email: userByEmail.email,
      firstName: userByEmail.firstName,
      lastName: userByEmail.lastName,
      isEmailVerified: userByEmail.isEmailVerified,
    });
  }

  async signInByEmail(email: string) {
    const userByEmail = await this.userStorage.getByEmail(email);

    return await this.generateJwtService.generateAccessToken({
      id: userByEmail.id,
      email: userByEmail.email,
      firstName: userByEmail.firstName,
      lastName: userByEmail.lastName,
      isEmailVerified: userByEmail.isEmailVerified,
    });
  }
}
