import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comments } from './comments.entity';

@Entity()
export class LikesComments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comments, (comment) => comment.likedComments)
  likedComments: Comments;

  @Column()
  liking: number;

  @Column({ default: false })
  likesStatus: boolean;

  @Column({ default: 0 })
  commentId: number;
}
