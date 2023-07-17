import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTime } from 'date-fns';
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
      const backendUrl = this.configService.get('app.backendUrl');
      const supportEmail = this.configService.get('app.supportEmail');
      const frontendUrl = this.configService.get('app.frontendUrl');
      function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const standardDelay = this.configService.get('app.monobankRequestDelay');
      for (const token of allTokens) {
        let { webHookUrl } = await this.monobankIntegration.getClientInfo({
          token: token.token,
        });
        const user = await this.userStorage.getUserBySpace(token.space.id);

        webHookUrl = ''; //for test error from localhost
        // webHookUrl =
        //   'https://api.my-mono-money.app/v1/integration/monobankWebHook/ae261db144b38993965'; //uncomment this for testing correct webHookUrl on prodction enviroment
        // webHookUrl = 'http://othersiteforwebhook.com/'; //for test error webhook link
        // backendUrl = 'https://my-mono-money.app'; //uncomment this for testing imitated production environment

        function checkCorrectWebHookUrk(webHookUrl: string) {
          const localHostFind = backendUrl.includes('localhost');
          const publicFind = 'my-mono-money';
          const tryFindPublicUrl = webHookUrl.includes(publicFind);
          if (webHookUrl && (localHostFind || tryFindPublicUrl)) {
            return true;
          } else {
            return false;
          }
        }
        let isWebHookUrlCorrect = false;
        let tryReipmortErrorMessage = '';
        if (!checkCorrectWebHookUrk(webHookUrl)) {
          await this.monobankIntegration.setWebHook({
            token: token.token,
            email: user.email,
          });

          const { webHookUrl: trySetWebHookUrl } =
            await this.monobankIntegration.getClientInfo({
              token: token.token,
            });

          // trySetWebHookUrl = 'http://othersiteforwebhook.com/'; //for test error webhook reconnect link
          // backendUrl = this.configService.get('app.backendUrl'); //for test imitated production environment
          if (!checkCorrectWebHookUrk(trySetWebHookUrl)) {
            isWebHookUrlCorrect = false;
          } else {
            const tokenData = await this.tokenStorage.getTokenByTokenValue(
              token.token,
            );
            console.log(
              'last normal import data',
              tokenData.lastSuccessfulWebhookValidationTime,
            );
            const startDate = Date.parse(
              tokenData.lastSuccessfulWebhookValidationTime.toString(),
            );
            const TOO_MANY_REQUESTS_ERROR = 'Too many requests';
            const dateNow = new Date();
            const transactions = [];
            console.log('startDate', String(getTime(startDate)));
            console.log('dateNow', String(getTime(dateNow)));
            const accountListFull =
              await this.statementStorage.getAccountByTokenId(token.id);
            const UAHCurrencyCode = 980;
            const accountList = accountListFull
              .filter((account) => account.currencyCode === UAHCurrencyCode)
              .filter((account) => account.maskedPan.length > 0);
            for (let i = 0; i < accountList.length; i++) {
              const result = await this.monobankIntegration.getStatement({
                token: accountList[i].token.token,
                accountId: accountList[i].id,
                from: String(getTime(startDate)),
                to: String(getTime(dateNow)),
              });
              // result.data = 'unnown error';
              if (Array.isArray(result.data)) {
                console.log(
                  'imported count by 1 account: ',
                  result.data.length,
                );
                transactions.push(
                  ...result.data.map((item) => ({
                    ...item,
                    account: {
                      id: accountList[i].id,
                    },
                  })),
                );
              } else {
                if (result.data === TOO_MANY_REQUESTS_ERROR) {
                  i--;
                  console.log('waiting 60s... ');
                  await delay(standardDelay);
                } else {
                  console.log('monobank error: ', result.data);
                  isWebHookUrlCorrect = false;
                  tryReipmortErrorMessage =
                    'Error reimport user statements, monobank error message: ' +
                    result.data;
                }
              }
            }
            console.log('transactions count: ', transactions.length);
            if (transactions.length > 0) {
              const trySaveToDB = await this.statementStorage.saveStatement({
                transactions,
              });
              if (trySaveToDB) {
                isWebHookUrlCorrect = true;
              } else {
                isWebHookUrlCorrect = false;
                tryReipmortErrorMessage = 'Error save to DB after reimport.';
              }
            } else if (!tryReipmortErrorMessage && transactions.length === 0) {
              isWebHookUrlCorrect = true;
            } else {
              isWebHookUrlCorrect = false;
            }

            //...
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
          //supportEmail
          await this.sendinblueIntegration.sendTransactionalEmail({
            to: {
              name: 'Support My Mono Money',
              email: 'a.kononuik@gmail.com',
            },
            subject: `Злетів вебхук у користувача: ${user.email}`,
            content: `У користувача злетів вебхук. Допоміжні дані - Користувач: ${
              user.email
            }, ім'я: ${
              user.firstName + ' ' + user.lastName
            }, url вебхука який злетів: ${webHookUrl}, spaceId користувача: ${
              token.space.id
            }. ${tryReipmortErrorMessage ? tryReipmortErrorMessage : ''}`,
          });
        }
      }
    } catch (e) {
      handleStorageError(e);
    }
  }
}
