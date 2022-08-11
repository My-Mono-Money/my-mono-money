import { Injectable } from '@nestjs/common';
import { getUnixTime } from 'date-fns';
import { StatementService } from 'src/layers/storage/services/statement.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IGetFilteredStatement {
  email: string;
  from: number;
  limit: number;
  card: string;
  period: string;
}

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
    const timestamp = (period) => {
      const arr = period.split('--');
      const result = {
        from: getUnixTime(new Date(arr[0])),
        to: getUnixTime(new Date(arr[1])),
      };
      return result;
    };
    return await this.statementService.getStatement({
      spaceId: space.id,
      from,
      limit,
      card,
      period: timestamp(period),
    });
  }
}
