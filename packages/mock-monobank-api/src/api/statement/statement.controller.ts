import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatementResponse } from './statement.response';
import statementData from '../statement/statement.data.json';

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
  @ApiTags('Genuine Monobank')
  statement(@Param() params): string {
    return JSON.stringify(statementData, null, 2);
  }
}
