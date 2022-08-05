import { Injectable } from '@nestjs/common';
import { MonobankService } from 'src/layers/integrations/monobank/monobank.service';
import { StatementService } from 'src/layers/storage/services/statement.service';
import {
  getUnixTime,
  startOfMonth,
  eachMonthOfInterval,
  addMonths,
  startOfYear,
} from 'date-fns';
import { ConfigService } from '@nestjs/config';

interface IGetStatement {
  tokenId: string;
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
    private monobankService: MonobankService,
    private statementService: StatementService,
    private configService: ConfigService,
  ) {}

  async getStatement({ tokenId }: IGetStatement) {
    const accountList = await this.statementService.getAccountByTokenId(
      tokenId,
    );
    const from = fromInTimestamp();
    const to = toInTimestamp();
    const transactions = [];
    for (let i = 0; i < accountList.length; i++) {
      for (let j = 0; j < from.length; j++) {
        const statementPart = await this.monobankService.getStatement({
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
    await this.statementService.saveStatement({ transactions });
  }
}
