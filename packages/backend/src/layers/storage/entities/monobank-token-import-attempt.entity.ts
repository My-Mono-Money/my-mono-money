import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ICreateMonobankTokenImportAttemptDto,
  ImportAttemptStatusType,
} from '../interfaces/create-monobank-token-import-attempt-dto.interface';
import { MonobankToken } from './monobank-token.entity';

@Entity()
export class MonobankTokenImportAttempt
  implements ICreateMonobankTokenImportAttemptDto
{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fetchedMonths: number;

  @Column()
  totalMonths: number;

  @Column()
  log: string;

  @Column({
    type: 'enum',
    enum: ImportAttemptStatusType,
  })
  status: ImportAttemptStatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MonobankToken)
  @JoinColumn()
  token: MonobankToken;
}
