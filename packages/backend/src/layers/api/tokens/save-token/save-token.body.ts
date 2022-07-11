import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveTokenBody {
  @ApiProperty({ example: 'u3_-for2akDnzxblQTF1NZK6GDeY-673aXgWZQa-wD5Y' })
  @IsNotEmpty()
  public token!: string;
}
