import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInBody {
  @ApiProperty({ example: 'dima@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: 'DimaExample2022!' })
  @IsNotEmpty()
  public password!: string;
}
