import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Likes } from './likes.entity';
import { Comments } from './comments.entity';

@Entity()
export class Postingan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000, default: '' })
  text: string;

  @Column({ default: '' })
  originalName: string;

  @Column({ default: '' })
  fileName: string;

  @Column({ default: '' })
  filePath: string;

  @ManyToOne(() => User, (user) => user.postings)
  user: User;

  @OneToMany(() => Likes, (likes) => likes.liked)
  liked: Likes[];

  @OneToMany(() => Comments, (comment) => comment.comment)
  comment: Comments[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
