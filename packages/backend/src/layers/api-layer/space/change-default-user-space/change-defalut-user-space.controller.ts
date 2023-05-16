import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { ChangeDefaultUserSpaceService } from 'src/layers/functionality/space/change-default-user-space.service.ts/change-defalut-user-space.service';
import { ChangeDefaultUserSpaceResponse } from './change-defalut-user-space.response';
import { ChangeDefaultUserSpaceBody } from './change-defalut-user-space.body';

@Controller({
  path: '/user',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ChangeDefaultUserSpaceController {
  constructor(
    private changeDefaultUserSpaceService: ChangeDefaultUserSpaceService,
  ) {}

  @Patch()
  @ApiResponse({
    status: 204,
    description: 'Successful changing user default space',
    type: ChangeDefaultUserSpaceResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Space')
  async inviteMember(
    @Body() { defaultSpace }: ChangeDefaultUserSpaceBody,
    @Req() request: IRequestWithUser,
  ): Promise<ChangeDefaultUserSpaceResponse> {
    await this.changeDefaultUserSpaceService.changeDefaultUserSpace({
      email: request.user.email,
      defaultSpace,
    });

    return {
      isSuccessful: true,
    };
  }
}
