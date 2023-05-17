import { ApiProperty } from '@nestjs/swagger';

export class InviteMemberResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
