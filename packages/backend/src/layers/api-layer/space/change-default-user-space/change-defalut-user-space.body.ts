import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangeDefaultUserSpaceBody {
  @ApiProperty({ example: 'bober@example.com' })
  @IsNotEmpty()
  public defaultSpace: string;
}
