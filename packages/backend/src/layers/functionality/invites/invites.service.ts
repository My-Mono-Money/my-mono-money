import { Injectable } from '@nestjs/common';
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
