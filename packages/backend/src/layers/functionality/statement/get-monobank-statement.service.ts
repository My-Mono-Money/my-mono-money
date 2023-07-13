import { Injectable } from '@nestjs/common';

import { startOfMonth, addMonths, format, getTime } from 'date-fns';
import { subMonths } from 'date-fns/fp';
import { ConfigService } from '@nestjs/config';
import { MonobankIntegration } from '~/integration/monobank/monobank.integration';
import { StatementStorage } from 'src/layers/storage/services/statement.storage';
import { UserStorage } from '~/storage/services/user.storage';
import { FeatureFlagStorage } from '~/storage/services/feature-flag.storage';
import { ImportAttemptStorage } from '~/storage/services/import-attempt.storage';
import {
  ImportAttemptLogDescription,
  ImportAttemptStatusType,
} from '~/storage/interfaces/create-monobank-token-import-attempt-dto.interface';
import { FeatureName } from '~/storage/interfaces/create-feature-flags-dto.interface';
import { isString } from 'class-validator';
import { Account } from '~/storage/entities/account.entity';
import { SendinblueIntegration } from '~/integration/sendinblue/sendinblue.integration';

interface IGetStatement {
  tokenId: string;
  importAttemptId: string;
  spaceOwnerEmail: string;
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatDate(date: Date) {
  return ' - ' + format(date, 'dd MMM yyyy HH:mm:ss ') + ' - ';
}

const TOO_MANY_REQUESTS_ERROR = 'Too many requests'; //Normal error says to wait 60 seconds
const OUT_OF_BOUNDS_ERROR = "Value field 'to' out of bounds"; //Normal error indicating import completed

type MonobankIntegrationResponse = Awaited<
  ReturnType<MonobankIntegration['getStatement']>
>;

function isImportFinishedResponse(response: MonobankIntegrationResponse) {
  return response.data === OUT_OF_BOUNDS_ERROR;
}

function isTooManyRequestResponse(response: MonobankIntegrationResponse) {
  return response.data === TOO_MANY_REQUESTS_ERROR;
}

//Removing normal errors from logs
function deleteNormalError(error: string) {
  if (error === TOO_MANY_REQUESTS_ERROR || error === OUT_OF_BOUNDS_ERROR) {
    return '';
  } else {
    return error;
  }
}
function errorStringOrArrayResult(statementPart: string | []) {
  return isString(statementPart)
    ? deleteNormalError(statementPart)
    : statementPart.length;
}

@Injectable()
export class GetMonobankStatementService {
  constructor(
    private monobankIntegration: MonobankIntegration,
    private statementStorage: StatementStorage,
    private configService: ConfigService,
    private featureFlagStorage: FeatureFlagStorage,
    private importAttemptStorage: ImportAttemptStorage,
    private userStorage: UserStorage,
    private sendinblueIntegration: SendinblueIntegration,
  ) {}

  private async writeLog(
    importAttemptId: string,
    message: string,
    status: ImportAttemptStatusType,
  ) {
    const importAttempt = await this.importAttemptStorage.getByImportAttemptId({
      id: importAttemptId,
    });
    await this.importAttemptStorage.updateImportAttempt(
      {
        status,
        log: [importAttempt.log, formatDate(new Date()), message, '\n'].join(
          '',
        ),
      },
      importAttemptId,
    );
  }

  private async fetchDataWithRetryOnError(
    args: Parameters<MonobankIntegration['getStatement']>[0],
    iteration = 0,
  ): Promise<MonobankIntegrationResponse> {
    const standardDelay = this.configService.get('app.monobankRequestDelay');
    const result = await this.monobankIntegration.getStatement(args);
    const featureFlags = await this.featureFlagStorage.getFeatureFlags();

    if (
      !result ||
      !result.data ||
      (isString(result.data) && deleteNormalError(result.data))
    ) {
      const delayTime = {
        0: standardDelay * 1,
        1: standardDelay * 2,
        2: standardDelay * 3,
      }[iteration];
      if (!delayTime) {
        throw new Error(result.data);
      }

      await delay(delayTime);
      return await this.fetchDataWithRetryOnError(args, iteration + 1);
    }

    if (!featureFlags[FeatureName.bypassMonobankRateLimit]) {
      await delay(this.configService.get('app.monobankRequestDelay'));
    }
    return result;
  }

  private async handleImportForOneAccount(
    account: Account,
    importAttemptId: string,
    accountIndex: number,
    accountList: Account[],
  ) {
    let monthsOffset = 0;
    const dateNow = new Date();
    const transactions = [];
    while (true) {
      const currentMonth = subMonths(monthsOffset, dateNow);
      const startDate = startOfMonth(currentMonth);
      const endDate = addMonths(startDate, 1);

      const currentStatement = await this.fetchDataWithRetryOnError({
        accountId: accountList[accountIndex].id,
        token: accountList[accountIndex].token.token,
        from: String(getTime(startDate)),
        to: String(getTime(endDate)),
      });

      if (isImportFinishedResponse(currentStatement)) {
        const importAttempt =
          await this.importAttemptStorage.getByImportAttemptId({
            id: importAttemptId,
          });
        if (accountIndex === 0) {
          //Adding totalMonths after the first iteration card
          await this.importAttemptStorage.updateTotalMonthsCount(
            importAttempt.fetchedMonths * accountList.length,
            importAttemptId,
          );
        }
        break;
      }
      if (isTooManyRequestResponse(currentStatement)) {
        await delay(this.configService.get('app.monobankRequestDelay'));
        continue;
      }

      monthsOffset += 1;
      await this.importAttemptStorage.updateFetchedMonthsCount(
        1,
        importAttemptId,
      );
      await this.writeLog(
        importAttemptId,
        `${
          'The month has been imported, from: ' +
          format(startDate, 'dd MMM yyyy HH:mm:ss ') +
          ' to: ' +
          format(endDate, 'dd MMM yyyy HH:mm:ss ') +
          ' fetched transaction count: ' +
          errorStringOrArrayResult(currentStatement.data)
        }`,
        ImportAttemptStatusType.InProgress,
      );
      if (Array.isArray(currentStatement.data)) {
        transactions.push(
          ...currentStatement.data.map((item) => ({
            ...item,
            account: {
              id: accountList[accountIndex].id,
            },
          })),
        );
      }
    }
    if (accountIndex === transactions.length - 1) {
      await this.importAttemptStorage.updateFetchedMonthsCount(
        1,
        importAttemptId,
      );
    }

    await this.writeLog(
      importAttemptId,
      `${
        ImportAttemptLogDescription.Successfully
      }import card: ${account.maskedPan.join(', ')}`,
      ImportAttemptStatusType.InProgress,
    );
    return transactions;
  }

  async getStatement({
    tokenId,
    importAttemptId,
    spaceOwnerEmail,
  }: IGetStatement) {
    await this.writeLog(
      importAttemptId,
      ImportAttemptLogDescription.StartStatementImportExecution,
      ImportAttemptStatusType.InProgress,
    );

    const accountListFull = await this.statementStorage.getAccountByTokenId(
      tokenId,
    );
    const UAHCurrencyCode = 980;
    const accountList = accountListFull
      .filter((account) => account.currencyCode === UAHCurrencyCode)
      .filter((account) => account.maskedPan.length > 0);

    try {
      const transactionsByOneCard = {};
      const transactions = [];
      for (let i = 0; i < accountList.length; i++) {
        const accountTransactions = await this.handleImportForOneAccount(
          accountList[i],
          importAttemptId,
          i,
          accountList,
        );

        transactions.push(...accountTransactions);
        transactionsByOneCard[accountList[i].maskedPan.join(', ')] =
          accountTransactions.length;
      }

      //If the webhook added a transaction, then we will not add a duplicate transaction
      const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
      const allStatments = await this.statementStorage.getAllStatements(
        space.id,
      );
      function removeDuplicates(firstArray, secondArray) {
        const uniqueIds = new Set(secondArray.map((obj) => obj.id));
        const filteredArray = firstArray.filter(
          (obj) => !uniqueIds.has(obj.id),
        );
        return filteredArray;
      }
      const filteredTransactions = removeDuplicates(transactions, allStatments);

      //save full result to DB
      const result = await this.statementStorage.saveStatement({
        transactions: filteredTransactions,
      });

      if (!result) {
        throw new Error(
          'Error save to DB. But transaction count: ' + transactions.length,
        );
      }
      await this.writeLog(
        importAttemptId,
        ImportAttemptLogDescription.Successfully + 'finished fetch all cards',
        ImportAttemptStatusType.Successful,
      );
      const user = await this.userStorage.getByEmail(spaceOwnerEmail);
      let content = `Імпортовано карток: ${accountList.length}. Імпортовано транзакцій за всі місяці: ${transactions.length}. Кількість транзакцій по карткам: `;

      for (let i = 0; i < accountList.length; i++) {
        const cardName = accountList[i].maskedPan.join(', ');
        const transactionCount = transactionsByOneCard[cardName];

        content += `\Картка - ${cardName}, кількість транзакцій: ${transactionCount}. `;
      }

      await this.sendinblueIntegration.sendTransactionalEmail({
        to: {
          name: user.firstName + ' ' + user.lastName,
          email: spaceOwnerEmail,
        },
        subject: 'Імпорт карток успішно завершений',
        content: content,
      });
    } catch (error) {
      // write to logs with error status
      await this.writeLog(
        importAttemptId,
        `${ImportAttemptLogDescription.Failed}  ' monobank server error: '
        ` + errorStringOrArrayResult(error.message),
        ImportAttemptStatusType.Failed,
      );
      const user = await this.userStorage.getByEmail(spaceOwnerEmail);
      const frontendUrl = this.configService.get('app.frontendUrl');
      await this.sendinblueIntegration.sendTransactionalEmail({
        to: {
          name: user.firstName + ' ' + user.lastName,
          email: spaceOwnerEmail,
        },
        subject: 'Помилка імпорту даних',
        content: `Текст помилки: ${error.message}. Ви можете перейти по посиланю і знову запустити імпорт: <html><head></head><body><p>${frontendUrl}</p></body></html>`,
      });

      await this.importAttemptStorage.removeFetchedMonthsCount(importAttemptId);
    }
  }
}
