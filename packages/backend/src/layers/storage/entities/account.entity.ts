import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ICreateAccountDto } from '../interfaces/create-account-dto.interface';
import { MonobankToken } from './monobank-token.entity';

@Entity()
export class Account implements ICreateAccountDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MonobankToken)
  @JoinColumn()
  token: MonobankToken;

  @Column()
  sendId: string;

  @Column()
  currencyCode: number;

  @Column()
  cashbackType: string;

  @Column()
  balance: number;

  @Column()
  creditLimit: number;

  @Column('varchar', { array: true })
  maskedPan: string[];

  @Column()
  type: string;

  @Column()
  iban: string;
}
