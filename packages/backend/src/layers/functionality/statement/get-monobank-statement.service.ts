import { Injectable } from '@nestjs/common';

import {
  getUnixTime,
  startOfMonth,
  eachMonthOfInterval,
  addMonths,
  startOfYear,
  endOfYear,
  format,
} from 'date-fns';
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

interface IGetStatement {
  tokenId: string;
  importAttemptId: string;
  spaceOwnerEmail: string;
}
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fromInTimestamp = (year: number) => {
  const currentDate = new Date();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - year,
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const startInterval = startOfYear(oneYearAgo);
  const endInterval = endOfYear(oneYearAgo);
  const monthsInYear = eachMonthOfInterval({
    start: startInterval,
    end: endInterval,
  });

  return monthsInYear.map((item) => String(getUnixTime(item)));
};

const toInTimestamp = (year: number) => {
  const currentDate = new Date();
  const oneYearAgo = new Date(
    currentDate.getFullYear() - year,
    currentDate.getMonth(),
    currentDate.getDate(),
  );
  const startInterval = addMonths(startOfYear(oneYearAgo), 1);
  const endInterval = startOfMonth(addMonths(endOfYear(oneYearAgo), 1));
  const monthsInYear = eachMonthOfInterval({
    start: startInterval,
    end: endInterval,
  });

  return monthsInYear.map((item) => String(getUnixTime(item)));
};

@Injectable()
export class GetMonobankStatementService {
  constructor(
    private monobankIntegration: MonobankIntegration,
    private statementStorage: StatementStorage,
    private configService: ConfigService,
    private featureFlagStorage: FeatureFlagStorage,
    private importAttemptStorage: ImportAttemptStorage,
    private userStorage: UserStorage,
  ) {}

  async getStatement({
    tokenId,
    importAttemptId,
    spaceOwnerEmail,
  }: IGetStatement) {
    function formatDate(date: Date) {
      return ' - ' + format(date, 'dd MMM yyyy HH:mm:ss ') + ' - ';
    }

    const featureFlags = await this.featureFlagStorage.getFeatureFlags();
    const importAttempt = await this.importAttemptStorage.getByImportAttemptId(
      importAttemptId,
    );

    await this.importAttemptStorage.updateImportAttempt(
      {
        status: ImportAttemptStatusType.InProgress,
        log:
          importAttempt.log +
          formatDate(new Date()) +
          ImportAttemptLogDescription.StartStatementImportExecution +
          '\n',
      },
      importAttemptId,
    );

    const accountList = await this.statementStorage.getAccountByTokenId(
      tokenId,
    );

    const findBlackCard = accountList
      .filter((account) => account.currencyCode === 980)
      .find((account) => account.type === 'black');

    //let valueForTesting = 0; //To test unknown server error
    let year = 0;
    let runImport = true;
    let attemptToReFetch = 1;
    const requestLimitExceededError = 'Too many requests';
    const cardHasNotBeenOpenedError = "Value field 'to' out of bounds";

    const transactions = [];
    for (let i = 0; i < 1; i++) {
      while (runImport) {
        const from = fromInTimestamp(year);
        const to = toInTimestamp(year);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const months =
          (currentDate.getFullYear() - currentYear) * 12 +
          currentDate.getMonth() +
          1;
        let length = 12;
        if (
          new Date((+from[0] as number) * 1000).getFullYear() === currentYear
        ) {
          length = months;
        }

        for (let j = length - 1; j >= 0; j--) {
          const statementPart = await this.monobankIntegration.getStatement({
            accountId: findBlackCard.id,
            token: findBlackCard.token.token,
            from: from[j],
            to: to[j],
          });

          //To test unknown server error
          // valueForTesting++;
          // if (valueForTesting >= 5) statementPart.data = 'unknown error';

          function deleteNormalError(error: string) {
            if (
              error === requestLimitExceededError ||
              error === cardHasNotBeenOpenedError
            ) {
              return '';
            } else {
              return error;
            }
          }
          const errorStringOrArrayResult = isString(statementPart.data)
            ? deleteNormalError(statementPart.data)
            : statementPart.data.length;

          if (statementPart.data.includes(requestLimitExceededError)) {
            await delay(this.configService.get('app.monobankRequestDelay'));
            j++; // Increment j to repeat the current iteration
            continue;
          }
          if (!featureFlags[FeatureName.bypassMonobankRateLimit]) {
            await delay(this.configService.get('app.monobankRequestDelay'));
          }

          if (statementPart.statusText) {
            if (statementPart.data === cardHasNotBeenOpenedError) {
              //If the webhook added a transaction, then we will not add a duplicate transaction
              const space = await this.userStorage.getSpaceByEmail(
                spaceOwnerEmail,
              );
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
              const filteredTransactions = removeDuplicates(
                transactions,
                allStatments,
              );

              //save result to DB
              const result = await this.statementStorage.saveStatement({
                transactions: filteredTransactions,
              });

              runImport = false;

              const monthsImportAttempt =
                await this.importAttemptStorage.getByImportAttemptId(
                  importAttemptId,
                );
              await this.importAttemptStorage.updateImportAttempt(
                {
                  status: result
                    ? ImportAttemptStatusType.Successful
                    : ImportAttemptStatusType.Failed,
                  log:
                    monthsImportAttempt.log +
                    formatDate(new Date()) +
                    (result
                      ? ImportAttemptLogDescription.Successfully
                      : ImportAttemptLogDescription.Failed) +
                    errorStringOrArrayResult +
                    '\n',
                },
                importAttemptId,
              );
              break;
            }

            //if monobank server unknown error, repeat connection with delay. 3 attempts
            if (
              isString(statementPart.data) &&
              deleteNormalError(statementPart.data)
            ) {
              let newDelay = this.configService.get('app.monobankRequestDelay');
              if (attemptToReFetch === 2) newDelay = newDelay * 5;
              if (attemptToReFetch === 3) newDelay = newDelay * 10;
              if (attemptToReFetch === 4) {
                runImport = false;
                const monthsImportAttempt =
                  await this.importAttemptStorage.getByImportAttemptId(
                    importAttemptId,
                  );
                await this.importAttemptStorage.updateImportAttempt(
                  {
                    status: ImportAttemptStatusType.Failed,
                    log:
                      monthsImportAttempt.log +
                      formatDate(new Date()) +
                      ImportAttemptLogDescription.Failed +
                      ' monobank server error: ' +
                      errorStringOrArrayResult +
                      '\n',
                  },
                  importAttemptId,
                );
                await this.importAttemptStorage.removeFetchedMonthsCount(
                  importAttemptId,
                );
                break;
              }
              await delay(newDelay);
              j++;
              attemptToReFetch++;
              continue;
            }
          }

          await delay(1000);

          const monthsImportAttempt =
            await this.importAttemptStorage.getByImportAttemptId(
              importAttemptId,
            );
          if (runImport) {
            await this.importAttemptStorage.updateFetchedMonthsCount(
              1,
              importAttemptId,
            );
            await this.importAttemptStorage.updateImportAttempt(
              {
                status: ImportAttemptStatusType.InProgress,
                log:
                  monthsImportAttempt.log +
                  formatDate(new Date()) +
                  'The month has been imported, from: ' +
                  format(
                    new Date((+from[j] as number) * 1000),
                    'dd MMM yyyy HH:mm:ss ',
                  ) +
                  ' to: ' +
                  format(
                    new Date((+to[j] as number) * 1000),
                    'dd MMM yyyy HH:mm:ss ',
                  ) +
                  'fetched transaction count: ' +
                  errorStringOrArrayResult +
                  '\n',
              },
              importAttemptId,
            );
          }

          transactions.push(
            ...statementPart.data.map((item) => ({
              ...item,
              account: {
                id: accountList[i].id,
              },
            })),
          );
        }
        year++;
      }
    }
  }
}
