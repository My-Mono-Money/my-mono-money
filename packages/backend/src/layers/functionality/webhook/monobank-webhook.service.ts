import { Injectable } from '@nestjs/common';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { UserService } from 'src/layers/storage/services/user.service';
import { StatementService } from '../../storage/services/statement.service';

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
    private userService: UserService,
    private statementService: StatementService,
  ) {}

  async saveTransaction({ transactionInfo, hash }: IMonobankWebHookData) {
    try {
      const user = await this.userService.geyByEmailHash(hash);
      if (!user) {
        throw new Error('Немає такого користувача');
      }
      return await this.statementService.saveStatement({
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
}
