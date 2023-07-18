import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Connection, In, Between, FindConditions, ILike } from 'typeorm';
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

  async getAllStatements(spaceId: string) {
    try {
      const where: FindConditions<Transaction> = {
        account: {
          token: {
            space: {
              id: spaceId,
            },
          },
        },
      };
      return await this.connection.manager.find<Transaction>(Transaction, {
        relations: ['account', 'account.token'],
        where,
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async saveStatement({ transactions }: ISaveStatement) {
    try {
      return await this.connection.transaction(async (manager) => {
        const chunkSize = 1000;
        const totalTransactions = transactions.length;

        for (let i = 0; i < totalTransactions; i += chunkSize) {
          const chunk = transactions.slice(i, i + chunkSize);
          return await manager.upsert<Transaction>(Transaction, chunk, ['id']);
        }
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
      const where: FindConditions<Transaction> = {
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
