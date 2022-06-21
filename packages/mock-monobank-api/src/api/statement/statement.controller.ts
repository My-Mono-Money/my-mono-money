import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StatementResponse } from './statement.response';

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
    return `Hello statement ${params.accountId}`;
  }
}
