import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class InviteMemberBody {
  @ApiProperty({ example: 'bober@example.com' })
  @IsEmail()
  public email: string;
}
