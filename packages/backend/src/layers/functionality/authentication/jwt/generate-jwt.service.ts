import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IVerifyEmailTokenPayload } from '../interfaces/verify-email-token-payload.interface';
import { IAccessTokenPayload } from '../interfaces/access-token-payload.interface';

@Injectable()
export class GenerateJwtService {
  constructor(private jwtService: JwtService) {}

  async generateVerifyEmail(user: IVerifyEmailTokenPayload) {
    const payload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    return this.jwtService.sign(payload);
  }

  async generateAccessToken(user: IAccessTokenPayload) {
    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isEmailVerified: user.isEmailVerified,
    };

    return this.jwtService.sign(payload);
  }
}
