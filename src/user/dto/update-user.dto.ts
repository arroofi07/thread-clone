import { CreateFollowDto } from './follow.dto';

export class UpdateUserDto {
  name: string;
  password: string;
  following: CreateFollowDto[];
  followers: CreateFollowDto[];
}
