import { Injectable } from '@nestjs/common';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';

interface IGetSpaceMembersData {
  spaceOwnerEmail: string;
}

@Injectable()
export class GetSpaceMembersService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
  ) {}

  async getSpaceMembers({ spaceOwnerEmail }: IGetSpaceMembersData) {
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
    const members = await this.spaceStorage.getSpaceMembers({
      spaceId: space.id,
      spaceOwnerEmail,
    });

    return members;
  }
}
