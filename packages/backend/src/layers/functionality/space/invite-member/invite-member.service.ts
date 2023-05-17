import { Injectable } from '@nestjs/common';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { SendEmailService } from '../../send-email/send-email.service';
import { ConfigService } from '@nestjs/config';
import { invitationMemberEmailTemplate } from '../../send-email/templates/invitation-member-email.email-template';
import { AccessDeniedError } from 'src/common/errors/access-denied-error';
import { NotAllowedError } from 'src/common/errors/no-allowed-error';
import { TokenStorage } from 'src/layers/storage/services/token.storage';
import { TokenEmptyError } from 'src/common/errors/token-empty-error';

interface IInviteMemberData {
  email: string;
  actorEmail: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class InviteMemberService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
    private sendEmailService: SendEmailService,
    private configService: ConfigService,
    private tokenStorage: TokenStorage,
  ) {}

  async sendInvitation({
    actorEmail,
    email,
    spaceOwnerEmail,
  }: IInviteMemberData) {
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
    const user = await this.userStorage.getByEmail(email);
    const frontendUrl = this.configService.get('app.frontendUrl');
    const tokenList = await this.tokenStorage.getTokenList({
      email: spaceOwnerEmail,
    });

    if (actorEmail !== spaceOwnerEmail) {
      throw new AccessDeniedError();
    }
    if (spaceOwnerEmail === email) {
      throw new NotAllowedError();
    }
    if (tokenList.length < 1) {
      throw new TokenEmptyError();
    }
    await this.spaceStorage.saveInvitation(
      {
        email,
        space,
        status: StatusType.NEW,
      },
      {
        afterSave: async () => {
          await this.sendEmailService.sendEmail(
            invitationMemberEmailTemplate({
              email,
              frontendUrl,
              user,
              spaceOwnerEmail,
            }),
          );
        },
      },
    );
  }
}
