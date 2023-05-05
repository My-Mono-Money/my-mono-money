import {
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { User } from './user.entity';
import { ICreateSpaceDto } from '../interfaces/create-space-dto.interface';

@Entity()
export class Space implements ICreateSpaceDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToOne('User', (user: User) => user.ownSpace)
  owner: User;
}
