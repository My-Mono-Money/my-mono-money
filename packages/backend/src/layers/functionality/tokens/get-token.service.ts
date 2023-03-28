import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { MonobankToken } from 'src/layers/storage/entities/monobank-token.entity';
import { UserService } from 'src/layers/storage/services/user.service';
import { Connection } from 'typeorm';

interface IGetTokenList {
  email: string;
}

@Injectable()
export class GetTokenService {
  constructor(
    private userService: UserService,
    private connection: Connection,
  ) {}

  async getTokenList({ email }: IGetTokenList) {
    const space = await this.userService.getSpaceByEmail(email);
    try {
      return await this.connection.manager.find<MonobankToken>(MonobankToken, {
        where: {
          space: {
            id: space.id,
          },
        },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }
}
