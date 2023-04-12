import { ApiProperty } from '@nestjs/swagger';

export class ResendVerificationEmailResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
