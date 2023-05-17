import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InviteMemberResponse } from './invite-member.response';
import { InviteMemberBody } from './invite-member.body';
import { InviteMemberService } from 'src/layers/functionality/space/invite-member/invite-member.service';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';

@Controller({
  path: '/spaces/:spaceOwnerEmail/members/invite',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class InviteMemberController {
  constructor(private inviteMemberService: InviteMemberService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Successful sending invitation to member',
    type: InviteMemberResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Space')
  async inviteMember(
    @Param('spaceOwnerEmail') spaceOwnerEmail: string,
    @Body() { email }: InviteMemberBody,
    @Req() request: IRequestWithUser,
  ): Promise<InviteMemberResponse> {
    await this.inviteMemberService.sendInvitation({
      actorEmail: request.user.email,
      email,
      spaceOwnerEmail,
    });

    return {
      isSuccessful: true,
    };
  }
}
