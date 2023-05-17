import { ApiProperty } from '@nestjs/swagger';

export class ChangeDefaultUserSpaceResponse {
  @ApiProperty({ example: true })
  isSuccessful: boolean;
}
