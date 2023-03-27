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
import { StatementService } from 'src/layers/storage/services/statement.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IGetFilteredStatement {
  email: string;
  from: number;
  limit: number;
  card?: string;
  period: string;
}

const day = startOfDay(new Date());
const week = startOfWeek(new Date(), { weekStartsOn: 2 });
const month = startOfMonth(new Date());
const quarter = startOfQuarter(new Date());
const year = startOfYear(new Date());

@Injectable()
export class GetFilteredStatementService {
  constructor(
    private statementService: StatementService,
    private userService: UserService,
  ) {}

  async getFilteredStatement({
    email,
    from,
    limit,
    card,
    period,
  }: IGetFilteredStatement) {
    const space = await this.userService.getSpaceByEmail(email);
    const [, offset] = period.split(':');
    const numberOffset = offset ? -Number(offset) : 0;
    const timestampList = (period: string) => {
      if (period.startsWith('day')) {
        return {
          from: getUnixTime(subDays(day, numberOffset)),
          to: getUnixTime(subDays(day, numberOffset - 1)),
        };
      }

      if (period.startsWith('week')) {
        return {
          from: getUnixTime(subWeeks(week, numberOffset)),
          to: getUnixTime(subWeeks(week, numberOffset - 1)),
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
    console.log('space', space);
    return await this.statementService.getStatement({
      spaceId: space.id,
      from,
      limit,
      card,
      period: timestampList(period),
    });
  }
}
