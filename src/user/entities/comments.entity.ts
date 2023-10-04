import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Postingan } from './postingan.entity';
import { LikesComments } from './likesComments.entity';
import { NextedComments } from './nextedComments.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Postingan, (postingan) => postingan.comment)
  comment: Postingan;

  @OneToMany(() => LikesComments, (likes) => likes.likedComments)
  likedComments: LikesComments[];

  @OneToMany(
    () => NextedComments,
    (nextedComments) => nextedComments.nextedComments,
  )
  nextedComments: NextedComments[];

  @Column({ default: '', type: 'varchar', length: 1000 })
  text: string;

  @Column({ default: ''})
  photoProfile: string;

  @Column({ default: 0 })
  userId: number;

  @Column({ default: 0 })
  postId: number;

  @Column({default:''})
  userName: string

}
