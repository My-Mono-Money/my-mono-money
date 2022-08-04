import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ICreateTransactionDto } from '../interfaces/create-transaction-dto.interface';
import { Account } from './account.entity';

@Entity()
export class Transaction implements ICreateTransactionDto {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column()
  time: number;

  @Column()
  description: string;

  @Column()
  mcc: number;

  @Column()
  originalMcc: number;

  @Column()
  hold: boolean;

  @Column()
  amount: number;

  @Column()
  operationAmount: number;

  @Column()
  currencyCode: number;

  @Column()
  commissionRate: number;

  @Column()
  cashbackAmount: number;

  @Column()
  balance: number;

  @Column({
    nullable: true,
  })
  comment?: string;

  @Column({
    nullable: true,
  })
  receiptId?: string;

  @Column({
    nullable: true,
  })
  invoiceId?: string;

  @Column({
    nullable: true,
  })
  counterEdrpou?: string;

  @Column({
    nullable: true,
  })
  counterIban?: string;
}
