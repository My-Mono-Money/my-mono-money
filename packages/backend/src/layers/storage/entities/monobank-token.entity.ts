import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ICreateMonobankTokenDto } from '../interfaces/create-monobank-token-dto.interface';
import { Space } from './space.entity';

@Entity()
export class MonobankToken implements ICreateMonobankTokenDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Space)
  @JoinColumn()
  space: Space;

  @Column()
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
