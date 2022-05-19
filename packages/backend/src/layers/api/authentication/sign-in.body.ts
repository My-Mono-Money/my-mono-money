import { ApiProperty } from '@nestjs/swagger';

export class SignInBody {
  @ApiProperty({ example: 'dima@example.com' })
  public email!: string;

  @ApiProperty({ example: 'DimaExample2022!' })
  public password!: string;
}
