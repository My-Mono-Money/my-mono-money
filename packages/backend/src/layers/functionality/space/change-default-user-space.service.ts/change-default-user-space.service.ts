import { Injectable } from '@nestjs/common';
import { UserService } from 'src/layers/storage/services/user.service';
import { IChangeDefaultUserSpace } from 'src/layers/storage/interfaces/change-default-user-space-dto.interface';

@Injectable()
export class ChangeDefaultUserSpaceService {
  constructor(private userService: UserService) {}

  async changeDefaultUserSpace({
    email,
    defaultSpace,
  }: IChangeDefaultUserSpace) {
    const space = await this.userService.getSpaceByEmail(defaultSpace);
    return await this.userService.changeDefaultSpace(email, space);
  }
}
