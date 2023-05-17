import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInService } from 'src/layers/functionality/authentication/sign-in.service';
import { SignInBody } from './sign-in.body';
import { SignInResponse } from './sign-in.response';

@Controller({
  path: '/auth',
  version: '1',
})
export class SignInController {
  constructor(private signInService: SignInService) {}

  @Post('/sign-in')
  @ApiResponse({
    status: 201,
    description: 'Successful sign in',
    type: SignInResponse,
  })
  @ApiTags('Authentication')
  async signIn(
    @Body() { email, password }: SignInBody,
  ): Promise<SignInResponse> {
    const accessToken = await this.signInService.signInByEmailWithPassword({
      email,
      password,
    });

    return {
      isSuccessful: true,
      accessToken,
    };
  }
}
