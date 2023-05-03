import { Controller, Get, Query, Req, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { GetFilteredStatementService } from 'src/layers/functionality/statement/get-filtered-statement.service';
import { GetFilteredStatementResponse } from './get-filtered-statement.response';

@Controller({
  path: '/spaces/:spaceOwnerEmail/statements',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetFilteredStatementController {
  constructor(
    private getFilteredStatementService: GetFilteredStatementService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Succesful get statement',
    type: GetFilteredStatementResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Statement')
  @ApiQuery({ name: 'card', required: false })
  async getFilteredStatement(
    @Param('spaceOwnerEmail') spaceOwnerEmail: string,
    @Query('from') from: number,
    @Query('limit') limit: number,
    @Query('period') period: string,
    @Query('search') search: string,
    @Query('card') card?: string,
  ): Promise<GetFilteredStatementResponse> {
    const result = await this.getFilteredStatementService.getFilteredStatement({
      spaceOwnerEmail,
      from,
      limit,
      card,
      search,
      period,
    });

    return {
      items: result.transactions.map((item) => ({
        id: item.id,
        account: item.account.id,
        time: item.time,
        description: item.description,
        mcc: item.mcc,
        originalMcc: item.originalMcc,
        hold: item.hold,
        amount: item.amount,
        operationAmount: item.operationAmount,
        currencyCode: item.currencyCode,
        commissionRate: item.currencyCode,
        cashbackAmount: item.cashbackAmount,
        balance: item.balance,
        comment: item.comment,
        receiptId: item.receiptId,
        invoiceId: item.invoiceId,
        counterEdrpou: item.counterEdrpou,
        counterIban: item.counterIban,
        category: item.category,
      })),
      paging: {
        from: Number(from),
        limit: Number(limit),
        total: result.transactionsCount,
      },
    };
  }
}
