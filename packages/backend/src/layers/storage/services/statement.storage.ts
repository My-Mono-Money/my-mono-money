import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Connection, In, Between, FindOptionsWhere, ILike } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { ICreateTransactionDto } from '../interfaces/create-transaction-dto.interface';

interface ISaveStatement {
  transactions: ICreateTransactionDto[];
}
interface IGetStatement {
  spaceId: string;
  from: number;
  limit: number;
  card?: string;
  search: string;
  period: {
    from: number;
    to: number;
  };
}

@Injectable()
export class StatementStorage {
  constructor(private connection: Connection) {}

  async getAccountByTokenId(tokenId: string) {
    try {
      return await this.connection.manager.find<Account>(Account, {
        relations: ['token'],
        where: {
          token: {
            id: tokenId,
          },
        },
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async saveStatement({ transactions }: ISaveStatement) {
    try {
      return await this.connection.transaction(async (manager) => {
        return await manager.insert<Transaction>(Transaction, transactions);
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async getStatement({
    spaceId,
    from,
    limit,
    card,
    period,
    search,
  }: IGetStatement) {
    try {
      const where: FindOptionsWhere<Transaction> = {
        account: {
          token: {
            space: {
              id: spaceId,
            },
          },
        },
        time: Between(period.from, period.to),
        description: ILike(`%${search}%`),
      };

      if (card) {
        Object.assign(where.account, {
          iban: In(card.split(',')),
        });
      }

      const [transactions, transactionsCount] =
        await this.connection.manager.findAndCount<Transaction>(Transaction, {
          relations: ['account', 'account.token'],
          where,
          take: limit,
          skip: from,
          order: {
            time: 'DESC',
          },
        });
      return { transactions, transactionsCount };
    } catch (e) {
      handleStorageError(e);
    }
  }
}
