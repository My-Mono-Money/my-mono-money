import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignUpService } from 'src/layers/functionality/authentication/sign-up.service';
import { SignUpBody } from './sign-up.body';
import { SignUpResponse } from './sign-up.response';

@Controller({
  path: '/auth',
  version: '1',
})
export class SignUpController {
  constructor(private signUpService: SignUpService) {}

  @Post('/sign-up')
  @ApiResponse({
    status: 201,
    description: 'Successful sign up',
    type: SignUpResponse,
  })
  @ApiTags('Authentication')
  async signUp(
    @Body() { email, password, firstName, lastName }: SignUpBody,
  ): Promise<SignUpResponse> {
    await this.signUpService.signUp({
      email,
      firstName,
      lastName,
      password,
    });

    return {
      isSuccessful: true,
    };
  }
}
