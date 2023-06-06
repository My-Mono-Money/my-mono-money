import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BypassMonobankRateLimit } from '../interfaces/create-feature-flags-dto.interface';

@Entity()
export class FeatureFlag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: BypassMonobankRateLimit,
  })
  featureName: BypassMonobankRateLimit;

  @Column({ default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
