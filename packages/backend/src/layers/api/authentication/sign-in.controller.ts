import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInBody } from './sign-in.body';
import { SignInResponse } from './sign-in.response';

const DUMMY_USER = {
  email: 'dima@example.com',
  password: 'DimaExample2022!',
};

const DUMMY_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhby5zYWxlbmtvK2pvaG5ueS5kZXBwQGdtYWlsLmNvbSIsImZpcnN0TmFtZSI6ItCU0LbQvtC90L3RliIsImxhc3ROYW1lIjoi0JTQtdC_0L8iLCJzaWQiOiJjYzhlNjQzNi0wMmY0LTQ2OGMtOTE2ZC05YjkzMDAwNDcxNzciLCJpYXQiOjE1MTYyMzkwMjJ9.DM5XibsUN6PNz2rEjmrVA9_MuCVrYi1I4HoPaXY-fEE';

@Controller('/auth')
export class SignInController {
  @Post('/sign-in')
  @ApiResponse({
    status: 201,
    description: 'Successful sign in',
    type: SignInResponse,
  })
  @ApiTags('Authentication')
  signIn(@Body() { email, password }: SignInBody): SignInResponse {
    if (email !== DUMMY_USER.email || password !== DUMMY_USER.password) {
      throw new HttpException(
        'wrong-username-or-password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      accessToken: DUMMY_TOKEN,
    };
  }
}
