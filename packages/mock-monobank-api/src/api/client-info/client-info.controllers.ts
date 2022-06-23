import { Controller, Get, Headers } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import clientInfoData from './client-info.data.json';
import { ClientInfoResponse } from './client-info.response';

@Controller('/personal')
export class ClientInfoController {
  @Get('/client-info')
  @ApiResponse({
    status: 200,
    description: 'Hello client info',
    type: ClientInfoResponse,
  })
  @ApiTags('Fake Monobank')
  clientInfo(@Headers('X-Token') xToken: string) {
    return JSON.stringify(clientInfoData, null, 2);
  }
}
