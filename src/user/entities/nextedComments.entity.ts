import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Comments } from './comments.entity';

@Entity()
export class NextedComments {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comments, (comments) => comments.nextedComments)
  nextedComments: Comments;

  @Column({ default: '', type: 'varchar', length: 1000 })
  text: string;

  @Column({ default: '' })
  photoProfile: string;

  @Column({ default: 0 })
  userId: number;

  @Column({ default: 0 })
  commentId: number;

  @Column({ default: '' })
  userName: string;
}
