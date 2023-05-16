import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { AcceptInviteResponse } from './accept-invite.response';
import { InvitesService } from 'src/layers/functionality/invites/invites.service';

@Controller({
  path: 'invites/:spaceOwnerEmail/accept',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class AcceptInviteController {
  constructor(private invitesService: InvitesService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successful accept invite',
    type: AcceptInviteResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Invites')
  async acceptInvitation(
    @Param('spaceOwnerEmail') spaceOwnerEmail: string,
    @Req() request: IRequestWithUser,
  ): Promise<AcceptInviteResponse> {
    await this.invitesService.acceptInvite({
      spaceOwnerEmail,
      invitedUserEmail: request.user.email,
    });

    return {
      isSuccessful: true,
    };
  }
}
