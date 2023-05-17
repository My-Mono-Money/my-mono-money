import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MonobankWebHookService } from 'src/layers/functionality/webhook/monobank-webhook.service';
import { MonobankWebHookBody } from './monobank-webhook.body';
import { MonobankWebHookResponse } from './monobank-webhook.response';

@Controller({
  path: '/integration/monobankWebHook/:hash',
  version: '1',
})
export class MonobankWebHookController {
  constructor(private monobankWebHookService: MonobankWebHookService) {}
  @Get()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: MonobankWebHookResponse,
  })
  @ApiTags('WebHook')
  async getStatus() {
    return {
      isSuccessful: true,
    };
  }

  @Post()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Successfully',
    type: MonobankWebHookResponse,
  })
  @ApiTags('WebHook')
  async saveTransaction(
    @Body() body: MonobankWebHookBody,
    @Param('hash') hash: string,
  ): Promise<MonobankWebHookResponse> {
    await this.monobankWebHookService.saveTransaction({
      transactionInfo: {
        ...body.data.statementItem,
        account: body.data.account,
      },
      hash,
    });
    return {
      isSuccessful: true,
    };
  }
}
