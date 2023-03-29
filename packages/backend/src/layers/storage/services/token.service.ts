import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Connection } from 'typeorm';
import { Account } from '../entities/account.entity';
import { MonobankToken } from '../entities/monobank-token.entity';
import { ICreateAccountDto } from '../interfaces/create-account-dto.interface';
import { ICreateSpaceDto } from '../interfaces/create-space-dto.interface';
import { UserService } from './user.service';

interface ISaveTokenWithAccountsDto {
  token: string;
  space: ICreateSpaceDto;
  accounts: ICreateAccountDto[];
}

interface IGetTokenList {
  email: string;
}

@Injectable()
export class TokenService {
  constructor(
    private connection: Connection,
    private userService: UserService,
  ) {}

  async saveTokenWithAccounts({
    token,
    space,
    accounts,
  }: ISaveTokenWithAccountsDto) {
    try {
      return await this.connection.transaction(async (manager) => {
        const tokenEntity = manager.create<MonobankToken>(MonobankToken, {
          token,
          space,
        });
        const savedToken = await manager.save(tokenEntity);
        await manager.insert<Account>(
          Account,
          accounts.map((item) => ({
            ...item,
            token: savedToken,
          })),
        );

        return savedToken;
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

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
