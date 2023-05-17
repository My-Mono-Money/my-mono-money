import { Injectable } from '@nestjs/common';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { IChangeDefaultUserSpace } from 'src/layers/storage/interfaces/change-default-user-space-dto.interface';

@Injectable()
export class ChangeDefaultUserSpaceService {
  constructor(private userStorage: UserStorage) {}

  async changeDefaultUserSpace({
    email,
    defaultSpace,
  }: IChangeDefaultUserSpace) {
    const space = await this.userStorage.getSpaceByEmail(defaultSpace);
    return await this.userStorage.changeDefaultSpace(email, space);
  }
}
