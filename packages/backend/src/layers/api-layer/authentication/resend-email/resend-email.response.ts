import { ApiProperty } from '@nestjs/swagger';

export class ResendEmailResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
