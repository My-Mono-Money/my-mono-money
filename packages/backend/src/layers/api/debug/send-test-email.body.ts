import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendTestEmailBody {
  @ApiProperty({ example: 'dima@example.com' })
  @IsEmail()
  public email!: string;
}
