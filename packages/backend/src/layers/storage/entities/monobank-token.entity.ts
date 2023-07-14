import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ICreateMonobankTokenDto,
  LastWebhookValidationStatusType,
} from '../interfaces/create-monobank-token-dto.interface';
import { Space } from './space.entity';
import { MonobankTokenImportAttempt } from './monobank-token-import-attempt.entity';

@Entity()
export class MonobankToken implements ICreateMonobankTokenDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Space)
  @JoinColumn()
  space: Space;

  @Column()
  token: string;

  @Column()
  monobankUserName: string;

  @Column()
  totalAccounts: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastSuccessfulWebhookValidationTime: Date;

  @Column({
    type: 'enum',
    enum: LastWebhookValidationStatusType,
    default: LastWebhookValidationStatusType.Active,
  })
  lastWebhookValidationStatus: LastWebhookValidationStatusType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => MonobankTokenImportAttempt,
    (importAttempt) => importAttempt.token,
  )
  importAttempts: MonobankTokenImportAttempt[];
}
