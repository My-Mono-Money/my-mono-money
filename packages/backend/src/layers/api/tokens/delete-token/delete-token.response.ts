import { ApiProperty } from '@nestjs/swagger';

export class DeleteTokenResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
