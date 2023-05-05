import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { GetSpacesResponse } from './get-spaces.response';
import { GetSpacesService } from 'src/layers/functionality/space/get-spaces/get-spaces.service';

@Controller({
  path: '/spaces',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetSpacesController {
  constructor(private getSpacesService: GetSpacesService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully get space list',
    type: GetSpacesResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Space')
  async getSpaces(
    @Req() request: IRequestWithUser,
  ): Promise<GetSpacesResponse> {
    const { email } = request.user;
    const result = await this.getSpacesService.getSpaceList({ email });
    return {
      items: result.map((item) => ({
        spaceOwnerEmail: item.spaceOwnerEmail,
        spaceOwnerName: item.spaceOwnerName,
        isDefault: item.isDefault,
      })),
    };
  }
}
