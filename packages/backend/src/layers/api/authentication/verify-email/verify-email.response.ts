import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
