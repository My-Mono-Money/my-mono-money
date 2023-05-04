import { Injectable } from '@nestjs/common';
import { SpaceService } from 'src/layers/storage/services/space.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IGetSpaceList {
  email: string;
}

@Injectable()
export class GetSpacesService {
  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
  ) {}

  async getSpaceList({ email }: IGetSpaceList) {
    const result = await this.spaceService.getSpaceListForUserByEmail(email);
    const user = await this.userService.getByEmail(email);
    return result.map((item) => {
      return {
        spaceOwnerEmail: item.owner.email,
        spaceOwnerName: `${item.owner.firstName} ${item.owner.lastName}`,
        isDefault: user.defaultSpace.id === item.id,
      };
    });
  }
}
