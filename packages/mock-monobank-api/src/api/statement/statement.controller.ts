import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatementResponse } from './statement.response';
import statementsData from './statement.data.json';

interface IStatementParams {
  accountId: string;
  fromTime: string;
  toTime: string;
}
@Controller('/personal')
export class StatementController {
  @Get('/statement/:accountId/:fromTime/:toTime')
  @ApiParam({
    name: 'accountId',
    type: 'string',
  })
  @ApiParam({
    name: 'fromTime',
    type: 'string',
  })
  @ApiParam({
    name: 'toTime',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'Hello statement',
    type: StatementResponse,
  })
  @ApiTags('Fake Monobank')
  statement(@Param() { accountId, fromTime, toTime }: IStatementParams) {
    const allCardStatement = statementsData.statementsByCard.find(
      (item) => item.cardId === accountId,
    ).items;

    const filteredByTime = allCardStatement.filter(
      (item) => Number(fromTime) <= item.time && item.time <= Number(toTime),
    );

    return JSON.stringify(filteredByTime, null, 2);
  }
}
