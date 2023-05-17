import { ApiProperty } from '@nestjs/swagger';

export class SaveTokenResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
