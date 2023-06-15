import { Injectable } from '@nestjs/common';
import { MonobankIntegration } from 'src/layers/integration/monobank/monobank.integration';
import { StatementStorage } from 'src/layers/storage/services/statement.storage';
import {
  getUnixTime,
  startOfMonth,
  eachMonthOfInterval,
  addMonths,
  startOfYear,
  format,
} from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { ICreateTransactionDto } from 'src/layers/storage/interfaces/create-transaction-dto.interface';
import { FeatureFlagStorage } from '~/storage/services/feature-flag.storage';
import { ImportAttemptStorage } from '~/storage/services/import-attempt.storage';
import { FeatureName } from '~/storage/interfaces/create-feature-flags-dto.interface';
import {
  ImportAttemptLogDescription,
  ImportAttemptStatusType,
} from '~/storage/interfaces/create-monobank-token-import-attempt-dto.interface';
import { UserStorage } from '~/storage/services/user.storage';

interface IGetStatement {
  tokenId: string;
  importAttemptId: string;
  spaceOwnerEmail: string;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fromInTimestamp = () => {
  const startInterval = startOfYear(new Date());
  const endInterval = startOfMonth(new Date());
  const monthsInYear = eachMonthOfInterval({
    start: startInterval,
    end: endInterval,
  });

  return monthsInYear.map((item) => String(getUnixTime(item)));
};

const toInTimestamp = () => {
  const startInterval = addMonths(startOfYear(new Date()), 1);
  const endInterval = startOfMonth(addMonths(new Date(), 1));
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
    private configService: ConfigService,
    private statementStorage: StatementStorage,
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

    const importAttemptInProgress =
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

    await this.importAttemptStorage.updateImportAttempt(
      {
        status: featureFlags[FeatureName.bypassMonobankRateLimit]
          ? ImportAttemptStatusType.Failed
          : ImportAttemptStatusType.Successful,
        log:
          importAttemptInProgress.log +
          formatDate(new Date()) +
          `${
            featureFlags[FeatureName.bypassMonobankRateLimit]
              ? ImportAttemptLogDescription.Failed
              : ImportAttemptStatusType.Successful
          }` +
          '\n',
      },
      importAttemptId,
    );

    const accountList = await this.statementStorage.getAccountByTokenId(
      tokenId,
    );

    const from = fromInTimestamp();
    const to = toInTimestamp();
    const transactions: ICreateTransactionDto[] = [];
    for (let i = 0; i < accountList.length; i++) {
      for (let j = 0; j < from.length; j++) {
        const statementPart = await this.monobankIntegration.getStatement({
          accountId: accountList[i].id,
          token: accountList[i].token.token,
          from: from[j],
          to: to[j],
        });
        await delay(this.configService.get('app.monobankRequestDelay'));
        transactions.push(
          ...statementPart.data.map((item) => ({
            ...item,
            account: {
              id: accountList[i].id,
            },
          })),
        );
      }
    }

    //If the webhook added a transaction, then we will not add a duplicate transaction
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
    const allStatments = await this.statementStorage.getAllStatements(space.id);

    function removeDuplicates(firstArray, secondArray) {
      const uniqueIds = new Set(secondArray.map((obj) => obj.id));
      const filteredArray = firstArray.filter((obj) => !uniqueIds.has(obj.id));
      return filteredArray;
    }
    const filteredTransactions = removeDuplicates(transactions, allStatments);
    await this.statementStorage.saveStatement({
      transactions: filteredTransactions,
    });
  }
}
