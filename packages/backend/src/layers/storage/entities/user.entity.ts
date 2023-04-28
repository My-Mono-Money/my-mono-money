import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ICreateUserDto } from '../interfaces/create-user-dto.interface';
import { Space } from './space.entity';

@Entity()
@Unique(['email'])
export class User implements ICreateUserDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Space, { nullable: false, eager: true })
  @JoinColumn()
  ownSpace: Space;

  @ManyToOne(() => Space, { nullable: false, eager: true })
  defaultSpace: Space;
}
