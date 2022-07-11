import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SaveTokenBody } from './save-token.body';
import { SaveTokenResponse } from './save-token.response';

@Controller({
  path: '/tokens',
  version: '1',
})
export class SaveTokenController {
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successful save token',
    type: SaveTokenResponse,
  })
  @ApiTags('Tokens')
  async saveToken(
    @Body() { token }: SaveTokenBody,
  ): Promise<SaveTokenResponse> {
    return {
      isSuccessful: true,
    };
  }
}
