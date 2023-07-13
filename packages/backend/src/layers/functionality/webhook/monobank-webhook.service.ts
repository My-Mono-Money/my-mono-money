import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { StatementStorage } from '~/storage/services/statement.storage';
import { TokenStorage } from '~/storage/services/token.storage';

interface IMonobankWebHookData {
  transactionInfo: {
    account: string;
    time: number;
    description: string;
    mcc: number;
    originalMcc: number;
    hold: boolean;
    amount: number;
    operationAmount: number;
    currencyCode: number;
    commissionRate: number;
    cashbackAmount: number;
    balance: number;
    comment?: string;
    receiptId?: string;
    invoiceId?: string;
    counterEdrpou?: string;
    counterIban?: string;
  };
  hash: string;
}

@Injectable()
export class MonobankWebHookService {
  constructor(
    private userStorage: UserStorage,
    private statementStorage: StatementStorage,
    private tokenStorage: TokenStorage,
  ) {}

  async saveTransaction({ transactionInfo, hash }: IMonobankWebHookData) {
    try {
      const user = await this.userStorage.geyByEmailHash(hash);
      if (!user) {
        throw new Error('Немає такого користувача');
      }
      return await this.statementStorage.saveStatement({
        transactions: [
          {
            ...transactionInfo,
            account: {
              id: transactionInfo.account,
            },
          },
        ],
      });
    } catch (e) {
      handleStorageError(e);
    }
  }

  async checkWebHook({}) {
    try {
      const allTokens = await this.tokenStorage.getAllTokens();
      for (const token of allTokens) {
        console.log(
          `перевіряю цілісність інтеграції токена ${token.monobankUserName}`,
        );
      }
    } catch (e) {
      handleStorageError(e);
    }
  }
}
