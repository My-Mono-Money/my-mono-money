import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { GetTokenResponse } from './get-token.response';
import { TokenService } from 'src/layers/functionality/tokens/get-token.service';

@Controller({
  path: '/tokens',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetTokenController {
  constructor(private tokenService: TokenService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully get token list',
    type: GetTokenResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Tokens')
  async getToken(@Req() request: IRequestWithUser): Promise<GetTokenResponse> {
    const { email } = request.user;
    const result = await this.tokenService.getTokenList({ email });
    const updatedResult = {
      items: result.map((item) => ({
        token: item.token,
        monobankUserName: item.monobankUserName,
        totalAccounts: item.totalAccounts,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        importAttempts: item.importAttempts.map((importAttempt) => ({
          id: importAttempt.id,
          fetchedMonths: importAttempt.fetchedMonths,
          totalMonths: importAttempt.totalMonths,
          status: importAttempt.status,
          createdAt: importAttempt.createdAt,
          updatedAt: importAttempt.updatedAt,
        })),
      })),
    };
    return updatedResult;
  }
}
