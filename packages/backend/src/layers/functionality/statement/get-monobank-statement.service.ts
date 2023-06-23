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

const requestLimitExceededError = 'Too many requests'; //Normal error says to wait 60 seconds
const cardHasNotBeenOpenedError = "Value field 'to' out of bounds"; //Normal error indicating import completed
//Removing normal errors from logs
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

    const accountListFull = await this.statementStorage.getAccountByTokenId(
      tokenId,
    );
    const UAHCurrencyCode = 980;
    const accountList = accountListFull.filter(
      (account) => account.currencyCode === UAHCurrencyCode,
    );

    // let valueForTesting = 0; //To test unknown server error. Uncomment for test
    let year = 0;
    let attemptToReFetch = 1;
    let exitFromAllCyclesWithError = false;

    const transactions = [];

    //Cards cycle
    for (let i = 0; i < accountList.length; i++) {
      if (exitFromAllCyclesWithError) break;

      let runImport = true;
      //Years cycle
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
        //Months cycle. Come from the end of the year. In order not to lose some of the months from the final year
        for (let j = length - 1; j >= 0; j--) {
          const statementPart = await this.monobankIntegration.getStatement({
            accountId: accountList[i].id,
            token: accountList[i].token.token,
            from: from[j],
            to: to[j],
          });

          //To test unknown server error. Uncomment for test
          // valueForTesting++;
          // if (valueForTesting >= 5) statementPart.data = 'unknown error';

          if (statementPart.data.includes(requestLimitExceededError)) {
            await delay(this.configService.get('app.monobankRequestDelay'));
            j++; // Increment j to repeat the current iteration(For the month)
            continue;
          }
          if (!featureFlags[FeatureName.bypassMonobankRateLimit]) {
            await delay(this.configService.get('app.monobankRequestDelay'));
          }

          if (statementPart.statusText) {
            //Exit the loop if import well
            if (statementPart.data === cardHasNotBeenOpenedError) {
              const importAttempt =
                await this.importAttemptStorage.getByImportAttemptId(
                  importAttemptId,
                );
              await this.importAttemptStorage.updateImportAttempt(
                {
                  status: ImportAttemptStatusType.InProgress,
                  log:
                    importAttempt.log +
                    formatDate(new Date()) +
                    ImportAttemptLogDescription.Successfully +
                    'import card: ' +
                    accountList[i].maskedPan[0] +
                    '\n',
                },
                importAttemptId,
              );

              if (i === 0) {
                //Adding totalMonths after the first iteration card
                await this.importAttemptStorage.updateTotalMonthsCount(
                  importAttempt.fetchedMonths * accountList.length,
                  importAttemptId,
                );
              }
              runImport = false;
              break;
            }

            //if monobank server unknown error, repeat connection with delay. 3 attempts. We exit all cycles with an error if the error does not go away
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
                      errorStringOrArrayResult(statementPart.data) +
                      '\n',
                  },
                  importAttemptId,
                );
                await this.importAttemptStorage.removeFetchedMonthsCount(
                  importAttemptId,
                );
                exitFromAllCyclesWithError = true;
                break;
              }
              await delay(newDelay);
              j++;
              attemptToReFetch++;
              continue;
            }
          }

          await delay(1000);
          //Update logs and fetchedMonths with each month iteration
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
                  errorStringOrArrayResult(statementPart.data) +
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
        year++; //Go fetch previous year
      }

      year = 0; //Starting from the beginning for the next card
    }

    if (!exitFromAllCyclesWithError) {
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

      const monthsImportAttempt =
        await this.importAttemptStorage.getByImportAttemptId(importAttemptId);
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
            'finished fetch all cards' +
            '\n',
        },
        importAttemptId,
      );
    }
  }
}
