import { Injectable } from '@nestjs/common';
import { SpaceService } from 'src/layers/storage/services/space.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IGetSpaceMembersData {
  spaceOwnerEmail: string;
}

@Injectable()
export class GetSpaceMembersService {
  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
  ) {}

  async getSpaceMembers({ spaceOwnerEmail }: IGetSpaceMembersData) {
    const space = await this.userService.getSpaceByEmail(spaceOwnerEmail);
    const members = await this.spaceService.getSpaceMembers({
      spaceId: space.id,
      spaceOwnerEmail,
    });

    return members;
  }
}
