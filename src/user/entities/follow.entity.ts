import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following)
  following: User;

  @ManyToOne(() => User, (user) => user.followers)
  follower: User;

  @Column({ default: 0 })
  userId: number;

  @Column({ default: 0 })
  userIdFollowing: number;

  @Column({ default: false })
  followStatus: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
