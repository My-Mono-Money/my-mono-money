import { Injectable } from '@nestjs/common';
import { MonobankService } from 'src/layers/integrations/monobank/monobank.service';
import { StatementService } from 'src/layers/storage/services/statement.service';
import { subMonths, getUnixTime } from 'date-fns';
import { ConfigService } from '@nestjs/config';

interface IGetStatement {
  tokenId: string;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fromInTimestamp = (month) => {
  const result = subMonths(new Date(), month);
  return String(getUnixTime(result));
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
    const from = fromInTimestamp(1);
    const to = String(getUnixTime(new Date()));
    const transactions = [];
    for (let i = 0; i < accountList.length; i++) {
      const statementPart = await this.monobankService.getStatement({
        accountId: accountList[i].id,
        token: accountList[i].token.token,
        from,
        to,
      });
      if (i !== accountList.length - 1) {
        await delay(this.configService.get('app.monobankRequestDelay'));
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
    await this.statementService.saveStatement({ transactions });
  }
}
