import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { RejectInviteResponse } from './reject-invite.response';
import { InvitesService } from 'src/layers/functionality/invites/invites.service';

@Controller({
  path: 'invites/:spaceOwnerEmail/reject',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class RejectInviteController {
  constructor(private invitesService: InvitesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successful reject invite',
    type: RejectInviteResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Invites')
  async acceptInvitation(
    @Param('spaceOwnerEmail') spaceOwnerEmail: string,
    @Req() request: IRequestWithUser,
  ): Promise<RejectInviteResponse> {
    await this.invitesService.rejectInvite({
      spaceOwnerEmail,
      invitedUserEmail: request.user.email,
    });

    return {
      isSuccessful: true,
    };
  }
}
