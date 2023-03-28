import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { GetTokenService } from 'src/layers/functionality/tokens/get-token.service';
import { GetTokenResponse } from './get-token.response';

@Controller({
  path: '/tokens',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetTokenController {
  constructor(private getTokenService: GetTokenService) {}
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
    const result = await this.getTokenService.getTokenList({ email });

    return {
      items: result.map((item) => ({
        token: item.token,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      })),
    };
  }
}
