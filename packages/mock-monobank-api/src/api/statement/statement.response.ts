import { ApiProperty } from '@nestjs/swagger';

export class StatementResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
