import { Controller, Param, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { GetSpaceMembersResponse } from './get-members.response';
import { GetSpaceMembersService } from 'src/layers/functionality/space/get-members/get-members.service';

@Controller({
  path: 'spaces/:spaceOwnerEmail/members',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetSpaceMembersController {
  constructor(private getSpaceMembersService: GetSpaceMembersService) {}

  @Get()
  @ApiResponse({
    status: 201,
    description: 'Successful get members',
    type: GetSpaceMembersResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Space')
  async getSpaceMembers(
    @Param('spaceOwnerEmail') spaceOwnerEmail: string,
  ): Promise<GetSpaceMembersResponse> {
    const items = await this.getSpaceMembersService.getSpaceMembers({
      spaceOwnerEmail,
    });

    return { items };
  }
}
