import { Injectable } from '@nestjs/common';
import { NotAllowedError } from 'src/common/errors/no-allowed-error';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { StatusType } from 'src/layers/storage/interfaces/create-space-member-invitation-dto.interface';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';

interface IAcceptInvite {
  spaceOwnerEmail: string;
  invitedUserEmail: string;
}

@Injectable()
export class InvitesService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
  ) {}

  async acceptInvite({ spaceOwnerEmail, invitedUserEmail }: IAcceptInvite) {
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
    const memberInvite = await this.spaceStorage.getMemberInvite(
      invitedUserEmail,
      space.id,
    );
    if (!memberInvite) {
      throw new NotFoundError();
    }
    if (memberInvite.status !== StatusType.NEW) {
      throw new NotAllowedError();
    }

    await this.spaceStorage.updateInvitationStatus(
      {
        email: invitedUserEmail,
        space,
        status: StatusType.ACCEPTED,
      },
      {
        afterSave: async () => {
          await this.userStorage.updateDefaultSpace(invitedUserEmail, space);
        },
      },
    );
  }
}
