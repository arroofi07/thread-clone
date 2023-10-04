import { IsString } from 'class-validator';

export class CreatePostingDto {
  @IsString()
  originalName: string;

  fileName: string;

  filePath: string;
}
