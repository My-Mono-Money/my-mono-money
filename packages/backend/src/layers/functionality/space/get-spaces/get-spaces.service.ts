import { Injectable } from '@nestjs/common';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { TokenStorage } from 'src/layers/storage/services/token.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';

interface IGetSpaceList {
  email: string;
}

@Injectable()
export class GetSpacesService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
    private tokenStorage: TokenStorage,
  ) {}

  async getSpaceList({ email }: IGetSpaceList) {
    let result = await this.spaceStorage.getSpaceListForUserByEmail(email);
    const user = await this.userStorage.getByEmail(email);
    const tokenList = await this.tokenStorage.getTokenList({ email });
    if (tokenList.length < 1 && result.length > 1) {
      result = result.filter((space) => space.owner.email !== email);
    }
    if (!result || result.length < 1) {
      return [];
    }
    const filteredResult = result.map((item) => {
      return {
        spaceOwnerEmail: item.owner.email,
        spaceOwnerName: `${item.owner.firstName} ${item.owner.lastName}`,
        isDefault: user.defaultSpace.id === item.id,
      };
    });

    if (filteredResult.find((item) => item.isDefault === true)) {
      return filteredResult;
    } else {
      filteredResult[0].isDefault = true;
      return filteredResult;
    }
  }
}
