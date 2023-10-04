import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Postingan } from './postingan.entity';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  liking: number;

  @ManyToOne(() => Postingan, (postingan) => postingan.liked)
  liked: Postingan;

  @Column({ default: 0 })
  postinganId: number;

  @Column({ default: true })
  likesStatus: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
