import { Injectable } from '@nestjs/common';
import { SpaceService } from 'src/layers/storage/services/space.service';
import { UserService } from 'src/layers/storage/services/user.service';
import { NotFoundError } from 'src/common/errors/not-found.error';

interface IRemoveMemberData {
  memberEmail: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class RemoveMemberService {
  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
  ) {}

  async removeInvitation({ spaceOwnerEmail, memberEmail }: IRemoveMemberData) {
    const space = await this.userService.getSpaceByEmail(spaceOwnerEmail);

    const result = await this.spaceService.removeInvitation({
      memberEmail,
      space,
    });

    if (!result) {
      throw new NotFoundError();
    }
  }
}
