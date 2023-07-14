import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { handleStorageError } from 'src/common/errors/utils/handle-storage-error';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import { MonobankIntegration } from '~/integration/monobank/monobank.integration';
import { SendinblueIntegration } from '~/integration/sendinblue/sendinblue.integration';
import { LastWebhookValidationStatusType } from '~/storage/interfaces/create-monobank-token-dto.interface';
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
    private monobankIntegration: MonobankIntegration,
    private configService: ConfigService,
    private sendinblueIntegration: SendinblueIntegration,
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
      const envServerUrl = this.configService.get('app.backendAppDomain');
      const supportEmail = this.configService.get('app.supportEmail');
      const frontendUrl = this.configService.get('app.frontendUrl');
      for (const token of allTokens) {
        const { webHookUrl } = await this.monobankIntegration.getClientInfo({
          token: token.token,
        });
        // webHookUrl = 'http://othersiteforwebhook.com/'; //for test error webhook link
        const user = await this.userStorage.getUserBySpace(token.space.id);

        function checkCorrectWebHookUrk(webHookUrl: string) {
          const localFind = 'ngrok-free';
          const publicFind = 'my-mono-money';
          const tryFindLocalUrl = webHookUrl.includes(localFind);
          const tryFindPublicUrl = webHookUrl.includes(publicFind);
          if (webHookUrl && (tryFindLocalUrl || tryFindPublicUrl)) {
            return true;
          } else {
            return false;
          }
        }
        let isWebHookUrlCorrect = false;
        if (!checkCorrectWebHookUrk(webHookUrl)) {
          await this.monobankIntegration.setWebHook({
            token: token.token,
            email: user.email,
          });

          const { webHookUrl: trySetWebHookUrl } =
            await this.monobankIntegration.getClientInfo({
              token: token.token,
            });

          // trySetWebHookUrl = 'http://othersiteforwebhook.com/'; //for test error webhook link

          if (!trySetWebHookUrl || !checkCorrectWebHookUrk(trySetWebHookUrl)) {
            isWebHookUrlCorrect = false;
          } else {
            isWebHookUrlCorrect = true;
          }
        } else {
          isWebHookUrlCorrect = true;
        }

        await this.tokenStorage.updateInTokenWebHookStatus({
          token: token.token,
          dateUpdate: !isWebHookUrlCorrect ? null : new Date(Date.now()),
          webHookStatus: !isWebHookUrlCorrect
            ? LastWebhookValidationStatusType.Error
            : LastWebhookValidationStatusType.Active,
        });

        if (!isWebHookUrlCorrect) {
          await this.sendinblueIntegration.sendTransactionalEmail({
            to: {
              name: user.firstName + ' ' + user.lastName,
              email: user.email,
            },
            subject: 'Автоматичне підтягування виписки не працює',
            content: `У вас перестала працювати інтеграція з Monobank. Ви можете перейти по посиланю і знову підключити вебхук для інтеграції з Monobank: <html><head></head><body><p>${frontendUrl}</p></body></html>. Інакше наступні ваші транзакції підтягуватись не будуть`,
          });

          await this.sendinblueIntegration.sendTransactionalEmail({
            to: {
              name: 'Support My Mono Money',
              email: supportEmail,
            },
            subject: 'Злетів вебхук у користувача',
            content: `У користувача злетів вебхук. Допоміжні дані - Користувач: ${
              user.email
            }, ім'я: ${
              user.firstName + ' ' + user.lastName
            }, url вебхука який злетів: ${webHookUrl}, spaceId користувача: ${
              token.space.id
            }`,
          });
        }
      }
    } catch (e) {
      handleStorageError(e);
    }
  }
}
