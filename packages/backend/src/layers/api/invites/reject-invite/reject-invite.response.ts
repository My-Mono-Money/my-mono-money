import { ApiProperty } from '@nestjs/swagger';

export class RejectInviteResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
