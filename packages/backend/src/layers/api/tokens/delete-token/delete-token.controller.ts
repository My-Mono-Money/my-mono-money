import { Param, Controller, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { DeleteTokenResponse } from './delete-token.response';
import { IsEmailVerifiedGuard } from 'src/layers/functionality/authentication/verify-email.guard';
import { DeleteTokenService } from '~/functionality/tokens/delete-token.service';

@Controller({
  path: '/tokens/:tokenId/delete',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class DeleteTokenController {
  constructor(private deleteTokenService: DeleteTokenService) {}

  @Delete()
  @UseGuards(IsEmailVerifiedGuard)
  @ApiResponse({
    status: 204,
    description: 'Successful delete token',
    type: DeleteTokenResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Tokens')
  async deleteToken(
    @Param('tokenId') tokenId: string,
    @Req() request: IRequestWithUser,
  ): Promise<DeleteTokenResponse> {
    const { email } = request.user;

    await this.deleteTokenService.delete({ tokenId, email });

    return {
      isSuccessful: true,
    };
  }
}
