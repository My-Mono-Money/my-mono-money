import { Injectable } from '@nestjs/common';
import { StatementService } from 'src/layers/storage/services/statement.service';
import { UserService } from 'src/layers/storage/services/user.service';

interface IGetFilteredStatement {
  email: string;
}

@Injectable()
export class GetFilteredStatementService {
  constructor(
    private statementService: StatementService,
    private userService: UserService,
  ) {}

  async getFilteredStatement({ email }: IGetFilteredStatement) {
    const space = await this.userService.getSpaceByEmail(email);
    return await this.statementService.getStatement({
      spaceId: space.id,
    });
  }
}
