import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/functionality/authentication/jwt/jwt-auth.guard';
import { GetImportAttemptResponse } from './get-import-attempt.response';
import { ImportAttemptService } from '~/functionality/tokens/import-attempt.service';
import { IRequestWithUser } from '~/common/interfaces/request-with-user.interface';

@Controller({
  path: '/tokens/:tokenId/import-attempts/:importAttemptId',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetImportAttemptController {
  constructor(private importAttemptService: ImportAttemptService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully get log list',
    type: GetImportAttemptResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Tokens')
  async getLog(
    @Param('tokenId') tokenId: string,
    @Param('importAttemptId') importAttemptId: string,
    @Req() request: IRequestWithUser,
  ): Promise<GetImportAttemptResponse> {
    const { email } = request.user;

    const result = await this.importAttemptService.getImportAttempt({
      importAttemptId,
      tokenId,
      email: email,
    });

    return {
      id: result.id,
      fetchedMonths: result.fetchedMonths,
      totalMonths: result.totalMonths,
      log: result.log,
      status: result.status,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
