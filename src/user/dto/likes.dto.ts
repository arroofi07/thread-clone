import { IsNotEmpty, isNotEmpty } from 'class-validator';

export class LikesDto {
  @IsNotEmpty()
  likedId: number;

}
