import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { ResendVerificationEmailService } from 'src/layers/functionality/authentication/resend-email.service';
import { ResendVerificationEmailResponse } from './resend-verification-email.response';
@Controller({
  path: '/auth',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ResendVerificationEmailController {
  constructor(private resendService: ResendVerificationEmailService) {}
  @Post('/resend-email')
  @ApiResponse({
    status: 201,
    description: 'Successful verify email',
    type: ResendVerificationEmailResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Authentication')
  async resendEmail(@Req() request: IRequestWithUser) {
    await this.resendService.resendEmail(request.user.email);
    return {
      isSuccessful: true,
    };
  }
}
