import { Injectable } from '@nestjs/common';
import { MonobankService } from 'src/layers/integrations/monobank/monobank.service';
import { StatementService } from 'src/layers/storage/services/statement.service';
import {
  getUnixTime,
  startOfMonth,
  eachMonthOfInterval,
  addMonths,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { ConfigService } from '@nestjs/config';

interface IGetStatement {
  tokenId: string;
}

function delay(ms: number) {
  if (+ms === 60000) {
    console.log(
      'Server request limit exceeded, waiting: ' + ms / 1000 + ' seconds',
    );
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fromInTimestamp = (year: number) => {
  // year = year + 1; //for testing another year
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
  console.log('monthsInYear fromInTimestamp count: ', monthsInYear.length);

  return monthsInYear.map((item) => String(getUnixTime(item)));
};

const toInTimestamp = (year: number) => {
  // year = year + 1; //for testing another year
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
  console.log('monthsInYear toInTimestamp count: ', monthsInYear.length);

  return monthsInYear.map((item) => String(getUnixTime(item)));
};

@Injectable()
export class GetMonobankStatementService {
  constructor(
    private monobankService: MonobankService,
    private statementService: StatementService,
    private configService: ConfigService,
  ) {}

  //OLD CODE
  // async getStatement({ tokenId }: IGetStatement) {
  //   console.log('worker start for token: ' + tokenId);
  //   const accountList = await this.statementService.getAccountByTokenId(
  //     tokenId,
  //   );
  //   console.log('get account list: ', accountList);
  //   const from = fromInTimestamp();
  //   const to = toInTimestamp();
  //   const transactions = [];
  //   for (let i = 0; i < accountList.length; i++) {
  //     console.log('try fetching... ');
  //     for (let j = 0; j < from.length; j++) {
  //       const statementPart = await this.monobankService.getStatement({
  //         accountId: accountList[i].id,
  //         token: accountList[i].token.token,
  //         from: from[j],
  //         to: to[j],
  //       });
  //       console.log('account: ' + accountList[i]);
  //       console.log('from: ' + from[j] + ' to' + to[j]);
  //       await delay(this.configService.get('app.monobankRequestDelay'));
  //       transactions.push(
  //         ...statementPart.data.map((item) => ({
  //           ...item,
  //           account: {
  //             id: accountList[i].id,
  //           },
  //         })),
  //       );
  //     }
  //   }
  //   console.log('finished fetch: ' + transactions);
  //   await this.statementService.saveStatement({ transactions });
  // }

  async getStatement({ tokenId }: IGetStatement) {
    const accountList = await this.statementService.getAccountByTokenId(
      tokenId,
    );
    console.log('get account list count: ', accountList.length);
    console.log('worker start for token: ' + tokenId);
    let year = 0;

    const transactions = [];
    for (let i = 0; i < accountList.length; i++) {
      console.log('try fetching... ');
      while (true) {
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
        console.log('month length in this year: ', length);
        for (let j = length - 1; j >= 0; j--) {
          const statementPart = await this.monobankService.getStatement({
            accountId: accountList[i].id,
            token: accountList[i].token.token,
            from: from[j],
            to: to[j],
          });
          console.log(
            'Requesting from: ' +
              new Date((+from[j] as number) * 1000) +
              ' to: ' +
              new Date((+to[j] as number) * 1000),
          );

          if (statementPart.statusText) {
            if (
              statementPart.data === "Value field 'to' out of bounds" ||
              statementPart.data === "Invalid value field 'to'"
            ) {
              if (statementPart.data === "Invalid value field 'to'") {
                console.log(
                  "Invalid value field 'to'. The formula needs to be corrected or an unknown bug has occurred. ",
                );
              }
              console.log('break');
              console.log(
                'finished fetch: ' + transactions.length + ' objects',
              );
              return await this.statementService.saveStatement({
                transactions,
              });
            } else {
              await delay(this.configService.get('app.monobankRequestDelay'));
            }
            // else {
            //   console.log(
            //     'Unknown error, worker stopped fetch, Possible error: ',
            //     statementPart.data,
            //   );
            //   return await this.statementService.saveStatement({
            //     transactions,
            //   });
            // }
          }
          console.log('fetched data count: ', statementPart.data.length);
          // await delay(this.configService.get('app.monobankRequestDelay'));
          await delay(1000);
          transactions.push(
            ...statementPart.data.map((item) => ({
              ...item,
              account: {
                id: accountList[i].id,
              },
            })),
          );
        }
        year = year + 1;
      }
    }
    console.log('finished fetch: ' + transactions.length + ' objects');
    await this.statementService.saveStatement({ transactions });
  }
}
