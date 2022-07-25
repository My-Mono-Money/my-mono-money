import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
