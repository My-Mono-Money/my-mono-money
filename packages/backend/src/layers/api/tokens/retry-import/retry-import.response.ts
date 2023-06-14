import { ApiProperty } from '@nestjs/swagger';

export class RetryImportResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
