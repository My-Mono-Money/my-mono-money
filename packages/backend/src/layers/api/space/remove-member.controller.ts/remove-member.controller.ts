import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RemoveMemberResponse } from './remove-member.response';

import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { RemoveMemberService } from 'src/layers/functionality/space/remove-member.service.ts/remove-member.service';

@Controller({
  path: '/spaces/:spaceOwnerEmail/members/:memberEmail',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RemoveMemberController {
  constructor(private removeMemberService: RemoveMemberService) {}

  @Delete()
  @ApiResponse({
    status: 204,
    description: 'Successful removed invitation',
    type: RemoveMemberResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Space')
  async inviteMember(
    @Param('spaceOwnerEmail') spaceOwnerEmail: string,
    @Param('memberEmail') memberEmail: string,
  ): Promise<RemoveMemberResponse> {
    await this.removeMemberService.removeInvitation({
      memberEmail,
      spaceOwnerEmail,
    });

    return {
      isSuccessful: true,
    };
  }
}
