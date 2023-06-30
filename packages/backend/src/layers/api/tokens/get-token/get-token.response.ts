import { ApiProperty } from '@nestjs/swagger';
import { MonobankTokenImportAttempt } from '~/storage/entities/monobank-token-import-attempt.entity';

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

  @ApiProperty()
  importAttempts: Array<Partial<MonobankTokenImportAttempt>>;
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
        importAttempts: [
          {
            id: '754d23c7-3188-49bd-a425-73fd3fcafbd4',
            fetchedMonths: 46,
            totalMonths: 46,
            status: 'successful',
            createdAt: '2023-03-27 11:48:24.682',
            updatedAt: '2023-03-27 11:49:24.682',
          },
        ],
      },
    ],
  })
  items: TokenItem[];
}
