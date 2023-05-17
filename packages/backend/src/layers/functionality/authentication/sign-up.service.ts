import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { SendEmailService } from '../send-email/send-email.service';
import { confirmEmailTemplate } from '../send-email/templates/confirm-email.email-template';
import { HashPasswordService } from './hashing/hash-password.service';
import { IUserSignUp } from './interfaces/user-signup-dto.interface';
import { GenerateJwtService } from './jwt/generate-jwt.service';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';

@Injectable()
export class SignUpService {
  constructor(
    private userStorage: UserStorage,
    private sendEmailService: SendEmailService,
    private generateJwtService: GenerateJwtService,
    private hashPasswordService: HashPasswordService,
    private configService: ConfigService,
    private spaceStorage: SpaceStorage,
  ) {}

  async signUp(user: IUserSignUp, spaceOwnerEmail?: string) {
    const passwordHash = await this.hashPasswordService.hashPassword({
      password: user.password,
    });

    const frontendUrl = this.configService.get('app.frontendUrl');
    if (spaceOwnerEmail) {
      const ownerSpace = await this.userStorage.getSpaceByEmail(
        spaceOwnerEmail,
      );
      const savedUser = await this.userStorage.save(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          passwordHash,
          isEmailVerified: true,
        },
        ownerSpace,
        {
          afterSave: async () => {
            await this.spaceStorage.updateInvitationStatus({
              email: user.email,
              space: ownerSpace,
              status: StatusType.ACCEPTED,
            });
          },
        },
      );
      const accessToken = await this.generateJwtService.generateAccessToken(
        savedUser,
      );
      return { accessToken };
    } else {
      const verifyEmailToken =
        await this.generateJwtService.generateVerifyEmail(user);
      await this.userStorage.save(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          passwordHash,
        },
        null,
        {
          afterSave: async () => {
            await this.sendEmailService.sendEmail(
              confirmEmailTemplate({ user, verifyEmailToken, frontendUrl }),
            );
          },
        },
      );
      const accessToken = verifyEmailToken;
      return { accessToken };
    }
  }
}
