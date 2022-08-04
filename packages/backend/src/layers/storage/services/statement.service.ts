import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { Connection } from 'typeorm';
import { Account } from '../entities/account.entity';
import { Transaction } from '../entities/transaction.entity';
import { ICreateTransactionDto } from '../interfaces/create-transaction-dto.interface';

interface ISaveStatement {
  transactions: ICreateTransactionDto[];
}

@Injectable()
export class StatementService {
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
}
