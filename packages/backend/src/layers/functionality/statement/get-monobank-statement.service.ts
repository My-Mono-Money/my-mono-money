import { Injectable } from '@nestjs/common';
import { MonobankIntegration } from 'src/layers/integration/monobank/monobank.integration';
import { StatementStorage } from 'src/layers/storage/services/statement.storage';
import {
  getUnixTime,
  startOfMonth,
  eachMonthOfInterval,
  addMonths,
  startOfYear,
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
import { dateNowForLogs } from '~/common/date-format/date-now';

interface IGetStatement {
  tokenId: string;
  importAttemptId: string;
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
  ) {}

  async getStatement({ tokenId, importAttemptId }: IGetStatement) {
    console.log(tokenId, importAttemptId);
    const featureFlag = await this.featureFlagStorage.getFeatureFlag(
      FeatureName.bypass_monobank_rate_limit,
    );
    const importAttempt = await this.importAttemptStorage.getByImportAttemptId(
      importAttemptId,
    );
    console.log('featureFlag.isEnabled', featureFlag.isEnabled);
    console.log('importAttempt', importAttempt);
    const importAttemptInProgress =
      await this.importAttemptStorage.updateImportAttempt(
        {
          status: ImportAttemptStatusType.InProgress,
          log:
            importAttempt.log +
            dateNowForLogs() +
            ImportAttemptLogDescription.StartStatementImportExecution +
            '\n',
        },
        importAttemptId,
      );
    console.log('importAttemptInProgress', importAttemptInProgress);

    if (featureFlag.isEnabled) {
      const importAttemptUpdateToFail =
        await this.importAttemptStorage.updateImportAttempt(
          {
            status: ImportAttemptStatusType.Failed,
            log:
              importAttemptInProgress.log +
              dateNowForLogs() +
              ImportAttemptLogDescription.Failed +
              '\n',
          },
          importAttemptId,
        );
      console.log('importAttemptUpdateToFail', importAttemptUpdateToFail);
    } else {
      const importAttemptUpdateToSuccess =
        await this.importAttemptStorage.updateImportAttempt(
          {
            status: ImportAttemptStatusType.Successful,
            log:
              importAttemptInProgress.log +
              dateNowForLogs() +
              ImportAttemptLogDescription.Successfully +
              '\n',
          },
          importAttemptId,
        );
      console.log('importAttemptUpdateToSuccess', importAttemptUpdateToSuccess);
    }
    // const accountList = await this.statementStorage.getAccountByTokenId(
    //   tokenId,
    // );
    // const from = fromInTimestamp();
    // const to = toInTimestamp();
    // const transactions: ICreateTransactionDto[] = [];
    // for (let i = 0; i < accountList.length; i++) {
    //   for (let j = 0; j < from.length; j++) {
    //     const statementPart = await this.monobankIntegration.getStatement({
    //       accountId: accountList[i].id,
    //       token: accountList[i].token.token,
    //       from: from[j],
    //       to: to[j],
    //     });
    //     await delay(this.configService.get('app.monobankRequestDelay'));
    //     transactions.push(
    //       ...statementPart.data.map((item) => ({
    //         ...item,
    //         account: {
    //           id: accountList[i].id,
    //         },
    //       })),
    //     );
    //   }
    // }
    // await this.statementStorage.saveStatement({ transactions });
  }
}
