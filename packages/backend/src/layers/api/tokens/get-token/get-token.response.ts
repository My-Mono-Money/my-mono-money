import { ApiProperty } from '@nestjs/swagger';

class TokenItem {
  @ApiProperty()
  token: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetTokenResponse {
  @ApiProperty({
    type: [TokenItem],
    isArray: true,
    example: [
      {
        token: 'u3_-for2akDnzxblQTF1NZK6GDeY-673aXgWZQa-wD5Y',
        createdAt: '2023-03-27 11:47:24.682',
        updatedAt: '2023-03-27 11:47:24.682',
      },
    ],
  })
  items: TokenItem[];
}
