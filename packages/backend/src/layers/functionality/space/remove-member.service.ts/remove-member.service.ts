import { Injectable } from '@nestjs/common';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { NotFoundError } from 'src/common/errors/not-found.error';

interface IRemoveMemberData {
  memberEmail: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class RemoveMemberService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
  ) {}

  async removeInvitation({ spaceOwnerEmail, memberEmail }: IRemoveMemberData) {
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);

    const result = await this.spaceStorage.removeInvitation({
      memberEmail,
      space,
    });

    if (!result) {
      throw new NotFoundError();
    }
  }
}
