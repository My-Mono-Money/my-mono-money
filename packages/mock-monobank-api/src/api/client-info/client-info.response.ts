import { ApiProperty } from '@nestjs/swagger';

export class ClientInfoResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
