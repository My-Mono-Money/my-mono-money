import { ApiProperty } from '@nestjs/swagger';

export class MonobankWebHookResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
