import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DebugAccessGuard } from 'src/layers/functionality/debug/debug-access.guard';
import { SendTestEmailService } from 'src/layers/functionality/debug/send-test-email.service';
import { SendTestEmailBody } from './send-test-email.body';
import { SendTestEmailResponse } from './send-test-email.response';

@Controller({
  path: '/debug',
  version: '1',
})
@UseGuards(DebugAccessGuard)
export class SendTestEmailController {
  constructor(private sendTestEmailService: SendTestEmailService) {}

  @Post('/send-test-email')
  @ApiResponse({
    status: 200,
    description: 'Successful send test email',
    type: SendTestEmailResponse,
  })
  @ApiBearerAuth('debug-token')
  @ApiTags('Debug')
  async sendTestEmail(
    @Body() { email }: SendTestEmailBody,
  ): Promise<SendTestEmailResponse> {
    await this.sendTestEmailService.addToQueue({ email });

    return {
      isSuccessful: true,
    };
  }
}
