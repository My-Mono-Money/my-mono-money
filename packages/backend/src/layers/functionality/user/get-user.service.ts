import { Injectable } from '@nestjs/common';
import { UserStorage } from 'src/layers/storage/services/user.storage';

@Injectable()
export class GetUserService {
  constructor(private userStorage: UserStorage) {}

  async getUser(email: string) {
    return await this.userStorage.getByEmail(email);
  }
}
