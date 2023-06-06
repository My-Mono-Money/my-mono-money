import { ApiProperty } from '@nestjs/swagger';

class TokenItem {
  @ApiProperty()
  token: string;

  @ApiProperty()
  monobankUserName: string;

  @ApiProperty()
  totalAccounts: number;

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
        monobankUserName: 'User Name',
        totalAccounts: 2,
        createdAt: '2023-03-27 11:47:24.682',
        updatedAt: '2023-03-27 11:47:24.682',
      },
    ],
  })
  items: TokenItem[];
}
