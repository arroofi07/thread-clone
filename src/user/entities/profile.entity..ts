import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: ""})
  alamat: string;

  @Column({default:""})
  bio: string

  @Column({default:""})
  tautan: string

  @Column({default:""})
  fileName: string;

  @Column({default:""})
  filePath: string;

  @ManyToOne(()=> User, (user) => user.profile)
  user: User
}
