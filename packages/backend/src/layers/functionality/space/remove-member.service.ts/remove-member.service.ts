import { Injectable } from '@nestjs/common';
import { SpaceStorage } from 'src/layers/storage/services/space.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { NotFoundError } from 'src/common/errors/not-found.error';
import { GetSpacesService } from '../get-spaces/get-spaces.service';

interface IRemoveMemberData {
  memberEmail: string;
  spaceOwnerEmail: string;
}

@Injectable()
export class RemoveMemberService {
  constructor(
    private userStorage: UserStorage,
    private spaceStorage: SpaceStorage,
    private getSpacesService: GetSpacesService,
  ) {}

  async removeInvitation({ spaceOwnerEmail, memberEmail }: IRemoveMemberData) {
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
    const spaceList = await this.spaceStorage.getSpaceListForUserByEmail(
      memberEmail,
    );

    const user = await this.userStorage.getByEmail(memberEmail);

    let tryFindDefaultSpace = null;
    if (user) {
      const getSpacesService = await this.getSpacesService.getSpaceList({
        email: memberEmail,
      });
      tryFindDefaultSpace = getSpacesService.find(
        (space) => space.spaceOwnerEmail === spaceOwnerEmail,
      );
    }

    const result = await this.spaceStorage.removeInvitation({
      memberEmail,
      space,
    });
    if (
      result &&
      tryFindDefaultSpace &&
      spaceList.length > 1 &&
      tryFindDefaultSpace.isDefault === true
    ) {
      await this.userStorage.changeDefaultSpace(memberEmail, spaceList[0]);
    }
    if (result && !tryFindDefaultSpace && spaceList.length <= 1) {
      if (user) {
        const spaceMember = await this.userStorage.getSpaceByEmail(user.email);
        await this.userStorage.changeDefaultSpace(user.email, spaceMember);
      }
    }

    if (!result) {
      throw new NotFoundError();
    }
    return result;
  }
}
