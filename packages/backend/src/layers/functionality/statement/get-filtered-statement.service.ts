import { Injectable } from '@nestjs/common';
import {
  getUnixTime,
  startOfDay,
  startOfMonth,
  startOfQuarter,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subQuarters,
  subWeeks,
  subYears,
} from 'date-fns';
import { StatementStorage } from 'src/layers/storage/services/statement.storage';
import { UserStorage } from 'src/layers/storage/services/user.storage';
import * as mccCodes from '~/common/mcc-codes/mcc-codes-ua.json';

interface IGetFilteredStatement {
  spaceOwnerEmail: string;
  from: number;
  limit: number;
  card?: string;
  period: string;
  search: string;
}

const day = startOfDay(new Date());
const week = startOfWeek(new Date(), { weekStartsOn: 2 });
const month = startOfMonth(new Date());
const quarter = startOfQuarter(new Date());
const year = startOfYear(new Date());

@Injectable()
export class GetFilteredStatementService {
  constructor(
    private statementStorage: StatementStorage,
    private userStorage: UserStorage,
  ) {}

  async getFilteredStatement({
    spaceOwnerEmail,
    from,
    limit,
    card,
    period,
    search,
  }: IGetFilteredStatement) {
    const space = await this.userStorage.getSpaceByEmail(spaceOwnerEmail);
    const [, offset] = period.split(':');
    const numberOffset = offset ? -Number(offset) : 0;

    const timestampList = (period: string) => {
      if (period.startsWith('day')) {
        const from = startOfDay(subDays(day, numberOffset));
        const to = startOfDay(subDays(day, numberOffset - 1));
        return {
          from: getUnixTime(from),
          to: getUnixTime(to),
        };
      }

      if (period.startsWith('week')) {
        const from = startOfWeek(subWeeks(week, numberOffset), {
          weekStartsOn: 1,
        });
        const to = startOfWeek(subWeeks(week, numberOffset - 1), {
          weekStartsOn: 1,
        });
        return {
          from: getUnixTime(from),
          to: getUnixTime(to),
        };
      }

      if (period.startsWith('month')) {
        return {
          from: getUnixTime(subMonths(month, numberOffset)),
          to: getUnixTime(subMonths(month, numberOffset - 1)),
        };
      }

      if (period.startsWith('quarter')) {
        return {
          from: getUnixTime(subQuarters(quarter, numberOffset)),
          to: getUnixTime(subQuarters(quarter, numberOffset - 1)),
        };
      }

      if (period.startsWith('year')) {
        return {
          from: getUnixTime(subYears(year, numberOffset)),
          to: getUnixTime(subYears(year, numberOffset - 1)),
        };
      } else {
        const arr = period.split('--');
        return {
          from: getUnixTime(new Date(arr[0])),
          to: getUnixTime(new Date(arr[1])),
        };
      }
    };
    const list = await this.statementStorage.getStatement({
      spaceId: space.id,
      from,
      limit,
      card,
      search,
      period: timestampList(period),
    });
    return {
      ...list,
      transactions: list.transactions.map((itemTransaction) => {
        return {
          ...itemTransaction,
          category: mccCodes.find(
            (itemCategory) =>
              itemCategory.mcc === itemTransaction.mcc.toString(),
          )?.shortDescription,
        };
      }),
    };
  }
}
