import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
