import { ApiProperty } from '@nestjs/swagger';

export class SendTestEmailResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
