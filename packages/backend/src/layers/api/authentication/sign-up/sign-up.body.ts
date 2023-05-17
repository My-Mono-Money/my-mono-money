import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class SignUpBody {
  @ApiProperty({ example: 'bober@example.com' })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: 'BoberExample2022!' })
  @IsNotEmpty()
  public password!: string;

  @ApiProperty({ example: 'Bober' })
  @IsNotEmpty()
  public firstName!: string;

  @ApiProperty({ example: 'Duzy' })
  @IsNotEmpty()
  public lastName!: string;

  @ApiProperty({ example: 'boberOwner@example.com' })
  @IsOptional()
  public spaceOwnerEmail?: string;
}
