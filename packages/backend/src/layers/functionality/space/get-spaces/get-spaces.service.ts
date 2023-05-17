import { Injectable } from '@nestjs/common';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';

interface IGetSpaceList {
  email: string;
}

@Injectable()
export class GetSpacesService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
  ) {}

  async getSpaceList({ email }: IGetSpaceList) {
    const result = await this.spaceStorage.getSpaceListForUserByEmail(email);
    const user = await this.userStorage.getByEmail(email);

    return result.map((item) => {
      return {
        spaceOwnerEmail: item.owner.email,
        spaceOwnerName: `${item.owner.firstName} ${item.owner.lastName}`,
        isDefault: user.defaultSpace.id === item.id,
      };
    });
  }
}
