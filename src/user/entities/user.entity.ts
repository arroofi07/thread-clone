import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from 'src/database/abstract.entity';
import { Follow } from './follow.entity';
import { Postingan } from './postingan.entity';
import { Profile } from './profile.entity.';

@Entity()
export class User extends AbstractEntity<User> {
  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  password: string;

  @OneToMany(() => Follow, (follow) => follow.follower)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  following: Follow[];

  @Column({ default: false })
  followStatus: boolean;

  @OneToMany(() => Postingan, (postingan) => postingan.user)
  postings: Postingan[];

  @OneToMany(() => Profile, (profile) => profile.user)
  profile: Profile[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // @OneToOne(() => Listing, { cascade: true })
  // @JoinColumn()
  // listing: Listing;

  // @OneToMany(() => Comment, (comment) => comment.user, { cascade: true })
  // comments: Comment[];

  // @ManyToMany(() => Tag, { cascade: true })
  // @JoinTable()
  // tags: Tag[];
}
