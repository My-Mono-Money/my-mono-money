import { ApiProperty } from '@nestjs/swagger';

export class RemoveMemberResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
