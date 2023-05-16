import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/layers/functionality/authentication/jwt/jwt-auth.guard';
import { GetUserResponse } from './get-user.response';
import { GetUserService } from 'src/layers/functionality/user/get-user.service';

@Controller({
  path: '/user/:email',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class GetUserController {
  constructor(private getUserService: GetUserService) {}
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Successfully get user',
    type: GetUserResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('User')
  async getUser(@Param('email') email: string) {
    const result = await this.getUserService.getUser(email);

    return {
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
    };
  }
}
