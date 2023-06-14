import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { RetryImportResponse } from './retry-import.response';
import { RetryImportService } from '~/functionality/tokens/retry-import.service';
import { IRequestWithUser } from '~/common/interfaces/request-with-user.interface';

@Controller({
  path: '/tokens/:tokenId/retry-import',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RetryImportController {
  constructor(private retryImportService: RetryImportService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successful starting import',
    type: RetryImportResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Tokens')
  async saveToken(
    @Param('tokenId') tokenId: string,
    @Req() request: IRequestWithUser,
  ): Promise<RetryImportResponse> {
    await this.retryImportService.startImport(tokenId, request.user.email);

    return {
      isSuccessful: true,
    };
  }
}
