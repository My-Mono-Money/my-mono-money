import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class MonobankWebHookStatementItem {
  @ApiProperty()
  public time: number;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public mcc: number;

  @ApiProperty()
  public originalMcc: number;

  @ApiProperty()
  public hold: boolean;

  @ApiProperty()
  public amount: number;

  @ApiProperty()
  public operationAmount: number;

  @ApiProperty()
  public currencyCode: number;

  @ApiProperty()
  public commissionRate: number;

  @ApiProperty()
  public cashbackAmount: number;

  @ApiProperty()
  public balance: number;

  @ApiProperty()
  public comment?: string;

  @ApiProperty()
  public receiptId?: string;

  @ApiProperty()
  public invoiceId?: string;

  @ApiProperty()
  public counterEdrpou?: string;

  @ApiProperty()
  public counterIban?: string;
}

class MonobankWebHookData {
  @ApiProperty()
  public account: string;

  @ApiProperty()
  public statementItem: MonobankWebHookStatementItem;
}

export class MonobankWebHookBody {
  @ApiProperty({
    example: 'StatementItem',
  })
  @IsNotEmpty()
  public type: string;

  @ApiProperty({
    example: {
      account: 'qxYvRUAGJ0HolEt5g2AaeA',
      statementItem: {
        time: 1680784074,
        description: 'Бубуся',
        mcc: 4829,
        originalMcc: 4829,
        amount: -465000,
        operationAmount: -465000,
        currencyCode: 980,
        commissionRate: 0,
        cashbackAmount: 0,
        balance: 22411,
        hold: true,
        receiptId: '8901-3571-EE69-9H32',
      },
    },
  })
  @IsNotEmpty()
  public data: MonobankWebHookData;
}
