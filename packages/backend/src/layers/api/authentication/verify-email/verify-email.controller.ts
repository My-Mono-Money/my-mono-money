import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { VerifyEmailService } from 'src/layers/functionality/authentication/verify-email.service';
import { VerifyEmailResponse } from './verify-email.response';

@Controller({
  path: '/auth',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class VerifyEmailController {
  constructor(private verifyEmailService: VerifyEmailService) {}

  @Post('/verify-email')
  @ApiResponse({
    status: 201,
    description: 'Successful verify email',
    type: VerifyEmailResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Authentication')
  async verifyEmail(@Req() request: IRequestWithUser) {
    await this.verifyEmailService.verifyEmail(request.user.email);

    return {
      isSuccessful: true,
    };
  }
}
