import { ApiProperty } from '@nestjs/swagger';

class StatementItem {
  @ApiProperty()
  account: string;

  @ApiProperty()
  time: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  mcc: number;

  @ApiProperty()
  originalMcc: number;

  @ApiProperty()
  hold: boolean;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  operationAmount: number;

  @ApiProperty()
  currencyCode: number;

  @ApiProperty()
  commissionRate: number;

  @ApiProperty()
  cashbackAmount: number;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  comment?: string;

  @ApiProperty()
  receiptId?: string;

  @ApiProperty()
  invoiceId?: string;

  @ApiProperty()
  counterEdrpou?: string;

  @ApiProperty()
  counterIban?: string;
}

export class GetFilteredStatementResponse {
  @ApiProperty({
    type: [StatementItem],
    isArray: true,
    example: [
      {
        id: 'InmZvtKavx_-tGkv',
        time: 1659939515,
        description: 'Щомісячний платіж rozetka.com.ua',
        mcc: 4829,
        originalMcc: 4829,
        amount: -202400,
        operationAmount: -202400,
        currencyCode: 980,
        commissionRate: 0,
        cashbackAmount: 0,
        balance: 2644039,
        hold: true,
      },
      {
        id: 'E1Wy4NZP6XSuF6YD',
        time: 1659878876,
        description: 'Lviv Croissants',
        mcc: 5814,
        originalMcc: 5814,
        amount: -12700,
        operationAmount: -12700,
        currencyCode: 980,
        commissionRate: 0,
        cashbackAmount: 0,
        balance: 2846439,
        hold: true,
        receiptId: '4287-05CK-MH7P-168H',
      },
    ],
  })
  items: StatementItem[];
  paging: {
    from: number;
    limit: number;
    total: number;
  };
}
