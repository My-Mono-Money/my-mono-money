import { Injectable } from '@nestjs/common';
import { NotAllowedError } from 'src/common/errors/no-allowed-error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';
import { SpaceService } from 'src/layers/storage/services/space.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IAcceptInvite {
  spaceOwnerEmail: string;
  invitedUserEmail: string;
}

@Injectable()
export class InvitesService {
  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
  ) {}

  async acceptInvite({ spaceOwnerEmail, invitedUserEmail }: IAcceptInvite) {
    const space = await this.userService.getSpaceByEmail(spaceOwnerEmail);
    const memberInvite = await this.spaceService.getMemberInvite(
      invitedUserEmail,
      space.id,
    );
    if (!memberInvite) {
      throw new NotFoundError();
    }
    if (memberInvite.status !== StatusType.NEW) {
      throw new NotAllowedError();
    }

    await this.spaceService.updateInvitationStatus(
      {
        email: invitedUserEmail,
        space,
        status: StatusType.ACCEPTED,
      },
      {
        afterSave: async () => {
          await this.userService.updateDefaultSpace(invitedUserEmail, space);
        },
      },
    );
  }
}
