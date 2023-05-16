import { Injectable } from '@nestjs/common';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';
import { SpaceService } from 'src/layers/storage/services/space.service';
import { UserService } from 'src/layers/storage/services/user.service';
import { SendEmailService } from '../../send-email/send-email.service';
import { ConfigService } from '@nestjs/config';
import { invitationMemberEmailTemplate } from '../../send-email/templates/invitation-member-email.email-template';
import { AccessDeniedError } from 'src/common/errors/access-denied-error';
import { NotAllowedError } from 'src/common/errors/no-allowed-error';
import { TokenService } from 'src/layers/storage/services/token.service';
import { TokenEmptyError } from 'src/common/errors/token-empty-error';

interface IInviteMemberData {
  email: string;
  actorEmail: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class InviteMemberService {
  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private sendEmailService: SendEmailService,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  async sendInvitation({
    actorEmail,
    email,
    spaceOwnerEmail,
  }: IInviteMemberData) {
    const space = await this.userService.getSpaceByEmail(spaceOwnerEmail);
    const user = await this.userService.getByEmail(email);
    const frontendUrl = this.configService.get('app.frontendUrl');
    const tokenList = await this.tokenService.getTokenList({
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
    await this.spaceService.saveInvitation(
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
