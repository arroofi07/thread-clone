// import { CreateListingDto } from './create-listing.dto';
// import { CreateTagDto } from './create-tag.dto';

import { IsAlphanumeric, IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsAlphanumeric()
  password: string;
  
  // listing: CreateListingDto;
  // tags: CreateTagDto[]
}
