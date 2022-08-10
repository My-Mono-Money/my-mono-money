import { Injectable } from '@nestjs/common';
import { StatementService } from 'src/layers/storage/services/statement.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IGetFilteredStatement {
  email: string;
  from: number;
  limit: number;
}

@Injectable()
export class GetFilteredStatementService {
  constructor(
    private statementService: StatementService,
    private userService: UserService,
  ) {}

  async getFilteredStatement({ email, from, limit }: IGetFilteredStatement) {
    const space = await this.userService.getSpaceByEmail(email);
    return await this.statementService.getStatement({
      spaceId: space.id,
      from,
      limit,
    });
  }
}
