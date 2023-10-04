// src/user/dto/follow.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowDto {
  @IsNotEmpty()
  followerId: number;

  @IsNotEmpty()
  followingId: number;

  userId: number

  followStatus: boolean

}
