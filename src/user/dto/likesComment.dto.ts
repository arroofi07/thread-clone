import { IsNotEmpty } from 'class-validator';

export class LikesCommentsDto {
  @IsNotEmpty()
  likedCommentsId: number;
}
