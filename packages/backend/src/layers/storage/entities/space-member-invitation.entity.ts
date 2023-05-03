import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import {
  ICreateSpaceMemberInvitationDto,
  StatusType,
} from '../interfaces/create-space-member-invitation-dto.interface';
import { Space } from './space.entity';

@Entity()
@Unique(['email', 'space'])
export class SpaceMemberInvitation implements ICreateSpaceMemberInvitationDto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: StatusType,
  })
  status: StatusType;

  @ManyToOne(() => Space)
  @JoinColumn()
  space: Space;
}
