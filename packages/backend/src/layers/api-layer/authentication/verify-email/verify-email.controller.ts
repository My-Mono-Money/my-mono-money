import {
  Controller,
  Get,
  Post,
  Req,
  Put,
  UseGuards,
  Query,
  Param,
  Redirect,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IRequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { VerifyEmailService } from 'src/layers/functionality/authentication/verify-email.service';
import { VerifyEmailResponse } from './verify-email.response';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
@Controller({
  path: '/',
  version: '1',
})
// @UseGuards(JwtAuthGuard)
export class VerifyEmailController {
  constructor(
    private verifyEmailService: VerifyEmailService, // private jwtService: GenerateJwtService,
  ) {}

  @Get('confirm-email')
  @Redirect('http://localhost:3000/', 301)
  async confirmEmail(@Query() token: any) {
    const decodedToken = jwt.verify(
      token.code,
      process.env.JWT_SECRET,
    ) as JwtPayload;
    console.log(decodedToken.email);
    console.log(process.env.FRONTEND_URL);
    const accessToken = await this.verifyEmailService.verifyEmail(
      decodedToken.email,
    );

    return {
      isSuccessful: true,
      accessToken,
    };
  }

  @Post('/verify-email')
  @ApiResponse({
    status: 201,
    description: 'Successful verify email',
    type: VerifyEmailResponse,
  })
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Authentication')
  async verifyEmail(@Req() request: IRequestWithUser) {
    console.log('asdsadasd');
    const accessToken = await this.verifyEmailService.verifyEmail(
      request.user.email,
    );

    return {
      isSuccessful: true,
      accessToken,
    };
  }
}
