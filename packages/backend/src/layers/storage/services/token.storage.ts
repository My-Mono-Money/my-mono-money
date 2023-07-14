import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Connection } from 'typeorm';
import { Account } from '../entities/account.entity';
import { MonobankToken } from '../entities/monobank-token.entity';
import { ICreateAccountDto } from '../interfaces/create-account-dto.interface';
import { ICreateSpaceDto } from '../interfaces/create-space-dto.interface';
import { UserStorage } from './user.storage';
import { LastWebhookValidationStatusType } from '../interfaces/create-monobank-token-dto.interface';

interface ISaveTokenWithAccountsDto {
  token: string;
  space: ICreateSpaceDto;
  accounts: ICreateAccountDto[];
  name: string;
}

interface IGetTokenList {
  email: string;
}

interface IUpdateWebHookStatusInToken {
  token: string;
  dateUpdate?: Date;
  webHookStatus: LastWebhookValidationStatusType;
}

@Injectable()
export class TokenStorage {
  constructor(
    private connection: Connection,
    private userService: UserStorage,
  ) {}

  async saveTokenWithAccounts({
    token,
    space,
    accounts,
    name,
  }: ISaveTokenWithAccountsDto) {
    try {
      return await this.connection.transaction(async (manager) => {
        const tokenEntity = manager.create<MonobankToken>(MonobankToken, {
          token,
          space,
          monobankUserName: name,
          totalAccounts: accounts.length,
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
      const tokens = await this.connection.manager
        .createQueryBuilder(MonobankToken, 'token')
        .leftJoinAndSelect('token.importAttempts', 'importAttempt')
        .where('token.space = :space', { space: space.id })
        .getMany();
      return tokens;
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getTokenByTokenValue(token: string) {
    try {
      return await this.connection.manager.findOne<MonobankToken>(
        MonobankToken,
        {
          where: { token: token },
        },
      );
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getTokenByTokenId(tokenId: string) {
    try {
      return await this.connection.manager.findOne<MonobankToken>(
        MonobankToken,
        {
          where: { id: tokenId },
          relations: ['space'],
        },
      );
    } catch (e) {
      handleStorageError(e);
    }
  }
  async getAllTokens() {
    try {
      return await this.connection.manager.find<MonobankToken>(MonobankToken, {
        relations: ['space'],
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async updateInTokenWebHookStatus({
    token,
    dateUpdate,
    webHookStatus,
  }: IUpdateWebHookStatusInToken) {
    try {
      const where = { token: token };
      let updateData = {};
      if (dateUpdate) {
        updateData = {
          lastSuccessfulWebhookValidationTime: dateUpdate,
          lastWebhookValidationStatus: webHookStatus,
        };
      } else {
        updateData = {
          lastWebhookValidationStatus: webHookStatus,
        };
      }
      return await this.connection.manager.update<MonobankToken>(
        MonobankToken,
        where,
        updateData,
      );
    } catch (e) {
      handleStorageError(e);
    }
  }
}
